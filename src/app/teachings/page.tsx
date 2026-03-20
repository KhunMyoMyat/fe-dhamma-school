"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sprout, FileText, ArrowUpRight, Loader2, Music2, Video, Globe } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { resolveFileUrl } from "@/lib/fileUrl";
import { cn } from "@/lib/utils";
import { collectSearchText, pickTranslation } from "@/lib/translations";
import Image from "next/image";

export default function TeachingsPage() {
  const [teachings, setTeachings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "mm" | "en" | "th">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchTeachings = async () => {
      try {
        const response = await api.get("/teachings/published");
        setTeachings(response.data || []);
      } catch (error) {
        console.error("Failed to fetch teachings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachings();
  }, []);

  const categories = useMemo(() => {
    const CANONICAL = [
      { id: "dhamma", label: "Dhamma" },
      { id: "dhamma_book", label: "Dhamma Book" },
      { id: "sutra", label: "Sutra" },
      { id: "vinaya", label: "Vinaya" },
      { id: "abhidhamma", label: "Abhidhamma" },
      { id: "meditation", label: "Meditation" },
      { id: "chanting", label: "Chanting" },
      { id: "other", label: "Other" },
    ];

    const counts = new Map<string, number>();

    teachings.forEach((t) => {
      const key = t.category ? String(t.category).toLowerCase() : "other";
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return [{ id: "all", label: "All", count: teachings.length }].concat(
      CANONICAL.map((cat) => ({
        ...cat,
        count: counts.get(cat.id) || 0,
      }))
    );
  }, [teachings]);

  const filteredTeachings = teachings.filter((teaching) => {
    // If filtering books, only show items with a document.
    if (selectedCategory === "dhamma_book" && !teaching.documentUrl) return false;

    const translations = Array.isArray(teaching.translations) ? teaching.translations : [];
    const languageFilteredTranslations =
      selectedLanguage === "all"
        ? translations
        : translations.filter((t: any) => t?.locale === selectedLanguage);

    const matchesLanguage =
      selectedLanguage === "all" || languageFilteredTranslations.length > 0;

    const searchText = collectSearchText(languageFilteredTranslations);
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (teaching.category && teaching.category.toLowerCase() === selectedCategory);
    return matchesLanguage && matchesSearch && matchesCategory;
  });

  const sortedTeachings = [...filteredTeachings].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
  });

  return (
    <div className="min-h-screen bg-cream/10 pt-20">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge className="bg-maroon/10 text-maroon hover:bg-maroon/20 mb-6 px-4 py-1.5 rounded-full border border-maroon/20 tracking-widest uppercase text-xs font-bold">
            Wisdom Library
          </Badge>
          <h1 className="text-6xl font-black text-maroon mb-8 tracking-tight">
            Sacred <span className="text-gradient-gold">Teachings</span>
          </h1>
          <p className="text-xl text-navy/70 leading-relaxed max-w-2xl mx-auto">
            Explore Buddha's teachings and access books you can read online or download for later practice.
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Teachings...</span>
          </div>
        ) : teachings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-maroon/10 rounded-[3rem] bg-white/50 backdrop-blur-sm">
            <div className="size-24 bg-maroon/5 rounded-full flex items-center justify-center mb-8">
              <Sprout className="size-12 text-maroon animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-maroon mb-4">Dhamma Articles Coming Soon</h2>
            <p className="text-navy/50 text-center max-w-md">
              Our library of sacred texts and wise reflections is currently being indexed for better wisdom discovery.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 p-6 mb-10 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search teachings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 bg-cream/30 border-2 border-gold/10 rounded-xl px-4 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/30 pointer-events-none" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as "all" | "mm" | "en" | "th")}
                      className="h-11 pl-10 pr-4 rounded-xl border-2 border-gold/10 bg-cream/30 font-bold text-navy/60 uppercase tracking-widest text-xs focus:border-maroon focus:bg-white outline-none transition-all"
                      title="Filter by language"
                      aria-label="Filter by language"
                    >
                      <option value="all">Any language</option>
                      <option value="mm">MM</option>
                      <option value="en">EN</option>
                      <option value="th">TH</option>
                    </select>
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="h-11 px-4 rounded-xl border-2 border-gold/10 bg-cream/30 font-bold text-navy/60 uppercase tracking-widest text-xs focus:border-maroon focus:bg-white outline-none transition-all"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("all");
                      setSelectedLanguage("all");
                      setSortOrder("newest");
                    }}
                    className="h-11 px-4 rounded-xl border-2 border-maroon/20 text-maroon font-bold text-xs uppercase tracking-widest hover:bg-maroon hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isZero = cat.id !== "all" && cat.count === 0;
                  return (
                  <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      disabled={isZero}
                      title={isZero ? "No posts yet" : ""}
                      className={cn(
                        "h-10 px-4 rounded-full border font-bold text-xs uppercase tracking-widest transition-colors",
                        isZero && "opacity-40 cursor-not-allowed border-gold/5 bg-cream/20 text-navy/30",
                        selectedCategory === cat.id
                          ? "bg-maroon text-white border-maroon"
                          : "bg-cream/30 text-navy/50 border-gold/10 hover:border-gold/30"
                      )}
                    >
                      {cat.label} <span className="ml-1 text-[10px] opacity-70">({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredTeachings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gold/20 rounded-[2rem] bg-white/70 text-navy/40">
                <Sprout className="size-10 mb-3" />
                <p className="font-bold">No teachings match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedTeachings.map((teaching, index) => {
                  const documentUrl = resolveFileUrl(teaching.documentUrl);
                  const coverUrl = resolveFileUrl(teaching.coverImageUrl);
                  const translation =
                    selectedLanguage === "all"
                      ? pickTranslation(teaching.translations)
                      : pickTranslation(teaching.translations, [selectedLanguage]);
                  const isBook = String(teaching.category || "").toLowerCase() === "dhamma_book";
                  return (
                    <motion.div
                      key={teaching.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="group bg-white rounded-[2rem] border border-gold/10 shadow-lg shadow-maroon/5 flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-maroon/10"
                    >
                      {isBook && (
                        <div className="relative w-full h-44 bg-cream/30 border-b border-gold/10">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={translation?.title || "Book cover"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-navy/30 font-bold uppercase tracking-widest text-xs">
                              No cover
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3 min-h-7">
                        <Badge className="bg-maroon/5 text-maroon border-maroon/10 uppercase tracking-widest text-[10px] font-black">
                          {teaching.category === "dhamma_book" ? "Dhamma Book" : (teaching.category || "dhamma")}
                        </Badge>
                        <div className="flex items-center gap-2 text-navy/30">
                          {teaching.audioUrl && <Music2 className="size-4" />}
                          {teaching.videoUrl && <Video className="size-4" />}
                          {teaching.documentUrl && <FileText className="size-4" />}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-maroon mb-1.5 leading-tight line-clamp-2 min-h-[3.25rem]">
                        {translation?.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-gold-dark font-bold uppercase tracking-widest mb-3 min-h-4">
                        {translation?.locale || ""}
                      </p>

                      {!isBook && (
                        <p className="text-navy/60 text-sm leading-relaxed break-words whitespace-pre-line line-clamp-3 min-h-[4.25rem]">
                          {translation?.content || "Summary coming soon."}
                        </p>
                      )}
                      {isBook && (
                        <p className="text-navy/50 text-sm leading-relaxed min-h-[4.25rem]">
                          PDF / eBook available to read and download.
                        </p>
                      )}

                      <div className="mt-5 space-y-3 flex-1 flex flex-col">
                        <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest min-h-4">
                          {teaching.teacher?.name ? (
                            <>Teacher: <span className="text-navy/70">{teaching.teacher.name}</span></>
                          ) : (
                            ""
                          )}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-auto">
                          <Link
                            href={`/teachings/${teaching.id}`}
                            className="inline-flex items-center gap-2 text-maroon font-bold text-sm hover:text-gold transition-colors"
                          >
                            {isBook ? "Open Book" : "Read Teaching"}
                            <ArrowUpRight className="size-4" />
                          </Link>
                          {documentUrl && (
                            <a
                              href={documentUrl}
                              download
                              className="inline-flex items-center gap-2 text-navy/60 font-bold text-sm hover:text-maroon transition-colors"
                            >
                              Download
                              <FileText className="size-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
