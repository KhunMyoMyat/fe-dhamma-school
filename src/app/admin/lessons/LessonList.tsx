"use client";
import { useState, useTransition, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteLesson, updateLesson } from "./actions";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  Search,
  Filter,
  Youtube,
  ExternalLink,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export function LessonList({ lessons: initialLessons }: { lessons: Lesson[] }) {
  const [lessons, setLessons] = useState(initialLessons);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set(initialLessons.map((l) => l.category));
    return Array.from(cats).sort();
  }, [initialLessons]);

  const filteredLessons = useMemo(() => {
    return lessons
      .filter((l) => {
        const matchesSearch =
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.youtubeId.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || l.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [lessons, search, categoryFilter]);

  const handleTogglePublish = async (lesson: Lesson) => {
    startTransition(async () => {
      const res = await updateLesson(lesson.id, {
        published: !lesson.published,
      });
      if (res.success && res.lesson) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lesson.id ? { ...l, published: !l.published } : l,
          ),
        );
        toast.success(
          `Lesson ${!lesson.published ? "published" : "unpublished"}!`,
        );
      } else {
        toast.error(res.error || "Failed to update lesson");
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteLesson(id);
      if (res.success) {
        setLessons((prev) => prev.filter((l) => l.id !== id));
        toast.success("Lesson deleted!");
      } else {
        toast.error(res.error || "Failed to delete lesson");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-maroon/5 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-maroon/30" />
          <Input
            placeholder="Search by title or video ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-11 pr-4 bg-white border-maroon/10 rounded-2xl focus:ring-maroon/20 focus:border-maroon transition-all font-medium"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-12 px-4 bg-white border border-maroon/10 rounded-2xl text-sm font-bold text-navy outline-none focus:ring-maroon/20 focus:border-maroon cursor-pointer appearance-none min-w-[140px]"
          title="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-maroon/10 rounded-[3rem] bg-white/50">
          <div className="size-20 bg-maroon/5 rounded-full flex items-center justify-center mb-6">
            <Youtube className="text-maroon/20 size-10" />
          </div>
          <p className="text-navy/40 font-bold uppercase tracking-widest text-xs">
            No lessons match your current filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-maroon/5 shadow-xl shadow-maroon/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-maroon/5 bg-maroon/[0.02]">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-maroon/40 uppercase tracking-[0.2em]">
                    Lesson Preview
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-maroon/40 uppercase tracking-[0.2em]">
                    Status & Details
                  </th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-maroon/40 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon/5">
                {filteredLessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="group hover:bg-gold/5 transition-colors duration-300"
                  >
                    <td className="px-6 py-5 align-top min-w-[320px]">
                      <div className="flex gap-4">
                        <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-maroon/5 shadow-sm group-hover:shadow-md transition-all">
                          <img
                            src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Youtube className="size-6 text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="font-bold text-navy line-clamp-1 leading-tight mb-1 group-hover:text-maroon transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-navy/30 uppercase">
                              ID: {lesson.youtubeId}
                            </span>
                            <a
                              href={`https://youtube.com/watch?v=${lesson.youtubeId}`}
                              target="_blank"
                              className="text-maroon/40 hover:text-maroon transition-colors"
                              title="View on YouTube"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/20 border-none px-2 py-0 h-5 text-[9px] font-black uppercase tracking-wider">
                            {lesson.category}
                          </Badge>
                          {lesson.published ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Live
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-navy/30">
                              <div className="size-1.5 rounded-full bg-navy/20" />
                              Draft
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-navy/40">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(lesson.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePublish(lesson)}
                          disabled={isPending}
                          title={
                            lesson.published ? "Unpublish" : "Publish Live"
                          }
                          className={
                            lesson.published
                              ? "size-10 rounded-xl hover:bg-maroon/5 text-maroon hover:text-maroon/60"
                              : "size-10 rounded-xl hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700"
                          }
                        >
                          {lesson.published ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(lesson.id, lesson.title)
                          }
                          disabled={isPending}
                          title="Delete Lesson"
                          className="size-10 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                        <div className="size-10 flex items-center justify-center text-maroon/10">
                          <ChevronRight className="size-5" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

