"use client";

import { useEffect, useState, use } from "react";
import { ChevronLeft, FileText, Loader2, Music2, Video } from "lucide-react";
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
            <div className="bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-maroon">Reading Material</h2>
                  <p className="text-sm text-navy/50 font-bold">{teaching.documentName || "Document"}</p>
                </div>
                <a
                  href={resolvedDocumentUrl}
                  download
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-maroon text-white font-bold hover:bg-gold hover:text-navy transition-colors"
                >
                  <FileText className="size-4" /> Download
                </a>
              </div>

              {showPdf ? (
                <div className="border border-gold/10 rounded-2xl overflow-hidden">
                  <iframe
                    title="Teaching PDF"
                    src={pdfViewerUrl}
                    className="w-full h-[70vh]"
                  />
                </div>
              ) : (
                <p className="text-navy/50 text-sm">
                  This file can be downloaded and read using your preferred eBook reader.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
