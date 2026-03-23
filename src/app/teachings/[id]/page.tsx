"use client";

import { useEffect, useState, use } from "react";
import { BookOpen, Calendar, ChevronDown, ChevronLeft, ChevronUp, Clock, FileText, History, Loader2, Maximize2, Minimize2, Music2, Save, StickyNote, Video } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { resolveFileUrl } from "@/lib/fileUrl";
import { pickTranslation } from "@/lib/translations";

function isPdf(docUrl?: string, docType?: string) {
  if (docType?.toLowerCase().includes("pdf")) return true;
  if (!docUrl) return false;
  return docUrl.toLowerCase().endsWith(".pdf");
}

function withPdfToolbar(url: string) {
  const [base, hash] = url.split("#");
  const params = "toolbar=0&navpanes=0&scrollbar=0";
  if (hash && hash.includes("toolbar=")) return url;
  return `${base}#${params}`;
}

export default function TeachingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [teaching, setTeaching] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Reading Progress State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [totalSpentTime, setTotalSpentTime] = useState<number>(0);
  const [lastReadDate, setLastReadDate] = useState<string | null>(null);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem(`reading_progress_${id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentPage(data.currentPage || 1);
      setTotalPage(data.totalPage || 0);
      setNotes(data.notes || "");
      setTotalSpentTime(data.totalSpentTime || 0);
      setLastReadDate(data.lastReadDate || null);
    }
  }, [id]);

  // Main save function
  const saveProgress = () => {
    const data = {
      currentPage,
      totalPage,
      notes,
      totalSpentTime: totalSpentTime + sessionTime,
      lastReadDate: new Date().toISOString(),
    };
    localStorage.setItem(`reading_progress_${id}`, JSON.stringify(data));
    setLastReadDate(data.lastReadDate);
    setTotalSpentTime(prev => prev + sessionTime);
    setSessionTime(0);
  };

  // Timer: Increments session time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debounced auto-save for non-timer changes (every 5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = {
        currentPage,
        totalPage,
        notes,
        totalSpentTime: totalSpentTime + sessionTime,
        lastReadDate: new Date().toISOString(),
      };
      localStorage.setItem(`reading_progress_${id}`, JSON.stringify(data));
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, currentPage, totalPage, notes, totalSpentTime, sessionTime]);

  // Handle page visibility for session saving
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveProgress();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentPage, totalPage, notes, totalSpentTime, sessionTime]); 

  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMaximized]);

  useEffect(() => {
    const fetchTeaching = async () => {
      try {
        const response = await api.get(`/teachings/${id}`);
        setTeaching(response.data);
      } catch (error) {
        console.error("Failed to fetch teaching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeaching();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream/10 pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-maroon/30">
          <Loader2 className="size-10 animate-spin" />
          <span className="font-bold uppercase tracking-widest text-xs">Loading Teaching...</span>
        </div>
      </div>
    );
  }

  if (!teaching) {
    return (
      <div className="min-h-screen bg-cream/10 pt-24 flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-10 rounded-3xl border border-red-100 font-bold text-center">
          Teaching not found.
        </div>
      </div>
    );
  }

  if (!teaching.isPublished) {
    return (
      <div className="min-h-screen bg-cream/10 pt-24 flex items-center justify-center">
        <div className="bg-cream/60 text-navy/50 p-10 rounded-3xl border border-gold/10 font-bold text-center">
          This teaching is not published yet.
        </div>
      </div>
    );
  }

  const resolvedDocumentUrl = resolveFileUrl(teaching.documentUrl);
  const resolvedCoverImageUrl = resolveFileUrl(teaching.coverImageUrl);
  const showPdf = isPdf(resolvedDocumentUrl, teaching.documentType);
  const pdfViewerUrl = resolvedDocumentUrl ? withPdfToolbar(resolvedDocumentUrl) : "";
  const translation = pickTranslation(teaching.translations);
  const isBook = String(teaching.category || "").toLowerCase() === "dhamma_book";

  return (
    <div className="min-h-screen bg-cream/10 pt-24">
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto mb-10">
          <Link
            href="/teachings"
            className="inline-flex items-center text-navy/40 hover:text-maroon font-bold text-sm mb-6 transition-colors group"
          >
            <ChevronLeft className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Teachings
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-maroon/10 text-maroon border-maroon/20 uppercase tracking-widest text-[10px] font-black">
              {teaching.category === "dhamma_book" ? "Dhamma Book" : (teaching.category || "dhamma")}
            </Badge>
            {teaching.audioUrl && <Music2 className="size-4 text-navy/40" />}
            {teaching.videoUrl && <Video className="size-4 text-navy/40" />}
            {resolvedDocumentUrl && <FileText className="size-4 text-navy/40" />}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-maroon mb-3 leading-tight">
            {translation?.title || "Untitled"}
          </h1>
          {translation?.locale && (
            <p className="text-gold-dark text-sm font-bold uppercase tracking-widest mb-4">
              {translation.locale}
            </p>
          )}
          {teaching.teacher?.name && (
            <p className="text-sm font-bold text-navy/50 uppercase tracking-widest">
              Teacher: <span className="text-navy/80">{teaching.teacher.name}</span>
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {!isBook && (
            <div className="bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-8">
              {translation?.content ? (
                <p className="text-navy/70 leading-relaxed whitespace-pre-line">
                  {translation.content}
                </p>
              ) : (
                <p className="text-navy/40">Full content will be updated soon.</p>
              )}
            </div>
          )}

          {isBook && resolvedCoverImageUrl && (
            <div className="bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-8 space-y-4">
              <h2 className="text-xl font-black text-maroon">Cover</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedCoverImageUrl}
                alt={translation?.title || "Book cover"}
                className="w-full max-h-[60vh] object-contain rounded-2xl border border-gold/10 bg-cream/10"
              />
            </div>
          )}

          {(teaching.audioUrl || teaching.videoUrl) && (
            <div className="bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-8 space-y-4">
              <h2 className="text-xl font-black text-maroon">Multimedia</h2>
              {teaching.audioUrl && (
                <a
                  href={teaching.audioUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-maroon font-bold hover:text-gold transition-colors"
                >
                  <Music2 className="size-4" /> Listen to Audio
                </a>
              )}
              {teaching.videoUrl && (
                <a
                  href={teaching.videoUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-maroon font-bold hover:text-gold transition-colors"
                >
                  <Video className="size-4" /> Watch Video
                </a>
              )}
            </div>
          )}

          {resolvedDocumentUrl && (
            <div className={`bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-8 space-y-4 transition-all duration-500 ease-in-out ${
              isMaximized ? "fixed inset-0 z-100 rounded-none m-0! bg-white/95 backdrop-blur-2xl flex flex-col p-4 md:p-8" : ""
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-maroon">Reading Material</h2>
                  <p className="text-sm text-navy/50 font-bold">{teaching.documentName || "Document"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMinimized(!isMinimized);
                      if (isMaximized) setIsMaximized(false);
                    }}
                    className="size-11 flex items-center justify-center rounded-xl bg-navy/5 text-navy/40 hover:bg-navy/10 hover:text-navy transition-all"
                    title={isMinimized ? "Show Content" : "Minimize Content"}
                  >
                    {!isMinimized ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsMaximized(!isMaximized);
                      if (isMinimized) setIsMinimized(false);
                    }}
                    className={`size-11 flex items-center justify-center rounded-xl transition-all ${
                      isMaximized ? "bg-maroon text-white hover:bg-maroon/90 shadow-lg shadow-maroon/20" : "bg-navy/5 text-navy/40 hover:bg-navy/10 hover:text-navy"
                    }`}
                    title={isMaximized ? "Exit Fullscreen" : "Full Screen"}
                  >
                    {isMaximized ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                  </button>
                  <a
                    href={resolvedDocumentUrl}
                    download
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-maroon text-white font-bold hover:bg-gold hover:text-navy transition-colors"
                  >
                    <FileText className="size-4" /> Download
                  </a>
                </div>
              </div>

              {!isMinimized && (
                <div className={`flex flex-col lg:flex-row gap-6 ${isMaximized ? "flex-1 min-h-0" : ""}`}>
                  {/* PDF Viewer */}
                  <div className={`flex-1 min-h-0 flex flex-col gap-4 ${isMaximized ? "h-full" : ""}`}>
                    {showPdf ? (
                      <div className={`border border-gold/10 rounded-3xl overflow-hidden bg-cream/5 flex-1 min-h-[60vh] relative shadow-inner ${
                        isMaximized ? "h-full" : ""
                      }`}>
                        <iframe
                          title="Teaching PDF"
                          src={pdfViewerUrl}
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="p-10 bg-cream/5 border border-dashed border-gold/20 rounded-3xl text-center">
                        <p className="text-navy/50 text-sm font-medium">
                          This file can be downloaded and read using your preferred eBook reader.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reading Tools Panel */}
                  <div className={`w-full lg:w-80 flex flex-col gap-6 ${isMaximized ? "lg:overflow-y-auto lg:pr-2" : ""}`}>
                    {/* Progression & Stats */}
                    <div className="bg-cream/20 rounded-[2rem] p-6 border border-gold/10 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-maroon flex items-center gap-2">
                          <BookOpen className="size-3.5" /> Reading Progress
                        </h3>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-navy">{totalPage > 0 ? Math.round((currentPage / totalPage) * 100) : 0}%</span>
                          <span className="text-[10px] font-bold text-navy/40 uppercase">Completed</span>
                        </div>
                        <div className="h-2 w-full bg-navy/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-maroon to-gold transition-all duration-1000 ease-out"
                            style={{ width: `${totalPage > 0 ? (currentPage / totalPage) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-navy/30 uppercase tracking-widest block">Current Page</label>
                          <input
                            type="number"
                            min="1"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full h-11 bg-white border border-gold/20 rounded-xl px-3 text-sm font-black text-navy focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-navy/30 uppercase tracking-widest block">Total Pages</label>
                          <input
                            type="number"
                            min="0"
                            value={totalPage}
                            onChange={(e) => setTotalPage(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full h-11 bg-white border border-gold/20 rounded-xl px-3 text-sm font-black text-navy focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gold/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 uppercase tracking-tighter">
                            <Clock className="size-3.5 text-maroon" />
                            <span className="text-[10px] font-black text-navy/50">Time Spent</span>
                          </div>
                          <span className="text-xs font-black text-navy">
                            {Math.floor((totalSpentTime + sessionTime) / 60)}m {((totalSpentTime + sessionTime) % 60).toString().padStart(2, "0")}s
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 uppercase tracking-tighter">
                            <Calendar className="size-3.5 text-maroon" />
                            <span className="text-[10px] font-black text-navy/50">Last Active</span>
                          </div>
                          <span className="text-xs font-black text-navy">
                            {lastReadDate ? new Date(lastReadDate).toLocaleDateString() : "New"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes Area */}
                    <div className="bg-white rounded-[2rem] p-6 border border-gold/10 flex-1 flex flex-col gap-3 min-h-[250px]">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-maroon flex items-center gap-2">
                        <StickyNote className="size-3.5" /> Study Notes
                      </h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your personal reflections or key takeaways here..."
                        className="flex-1 w-full bg-cream/5 border border-gold/10 rounded-2xl p-4 text-sm leading-relaxed text-navy/70 placeholder:text-navy/20 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all resize-none"
                      />
                    </div>

                    <button
                      onClick={saveProgress}
                      className="group relative h-14 w-full bg-maroon text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold hover:text-navy transition-all duration-300 shadow-xl shadow-maroon/10"
                    >
                      <Save className="size-4 group-hover:scale-110 transition-transform" />
                      Save My Progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
