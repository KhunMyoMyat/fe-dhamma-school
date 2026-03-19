"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  FileText,
  Sprout,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { resolveFileUrl } from "@/lib/fileUrl";
import { collectSearchText, pickTranslation } from "@/lib/translations";

export default function AdminTeachingsPage() {
  const [teachings, setTeachings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeachings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/teachings");
      setTeachings(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching teachings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachings();
  }, []);

  const filteredTeachings = teachings.filter((t) => {
    const searchText = collectSearchText(t.translations);
    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Teachings <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-medium">
            Manage teachings and resources ({teachings.length})
          </p>
        </div>
        <Link href="/admin/teachings/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Teaching
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gold/10 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/20 group-focus-within:text-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search teachings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-cream/30 border-none rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-maroon/20 outline-none font-myanmar font-medium"
          />
        </div>
        <Button variant="outline" className="h-12 border-gold/20 rounded-xl px-6 font-bold text-navy/60">
          Filter
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Teachings...</span>
          </div>
        ) : filteredTeachings.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-navy/20">
            <Sprout className="size-12" />
            <p className="font-bold">No teachings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 border-b border-gold/10">
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Teaching</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Category</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Teacher</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Document</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filteredTeachings.map((teaching) => (
                  <tr key={teaching.id} className="group hover:bg-cream/20 transition-colors">
                    <td className="p-6">
                      <div>
                        {(() => {
                          const translation = pickTranslation(teaching.translations);
                          return (
                            <>
                              <p className="font-black text-maroon text-lg leading-none mb-1">
                                {translation?.title || "Untitled"}
                              </p>
                              {translation?.locale && (
                                <p className="text-xs text-gold-dark font-bold uppercase tracking-widest">
                                  {translation.locale}
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-maroon/5 text-maroon border-maroon/10 capitalize font-bold px-3 py-0.5">
                        {teaching.category || "dhamma"}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-maroon/5 flex items-center justify-center">
                          <BookOpen className="size-3 text-maroon" />
                        </div>
                        <span className="font-bold text-navy/70 text-sm">
                          {teaching.teacher?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      {teaching.documentUrl ? (
                        <a
                          href={resolveFileUrl(teaching.documentUrl)}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-maroon font-bold hover:text-gold transition-colors text-sm"
                        >
                          <FileText className="size-4" />
                          {teaching.documentName || "Document"}
                        </a>
                      ) : (
                        <span className="text-xs text-navy/30 font-bold">No file</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const newStatus = !teaching.isPublished;
                              await api.put(`/teachings/${teaching.id}`, { isPublished: newStatus });
                              toast.success(`Teaching ${newStatus ? 'published' : 'hidden'} successfully!`);
                              fetchTeachings();
                            } catch (error) {
                              toast.error("Failed to update status.");
                            }
                          }}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/20",
                            teaching.isPublished ? "bg-green-500" : "bg-navy/20"
                          )}
                          title="Toggle Publish Status"
                        >
                          <span className="sr-only">Toggle Publish</span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              teaching.isPublished ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </button>
                        <span className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          teaching.isPublished ? "text-green-600" : "text-navy/30"
                        )}>
                          {teaching.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/teachings/${teaching.id}`} target="_blank">
                          <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="View on Site">
                            <Eye className="size-5" />
                          </button>
                        </Link>
                        <Link href={`/admin/teachings/${teaching.id}`}>
                          <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="Edit Teaching">
                            <Edit2 className="size-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this teaching?")) {
                              const promise = api.delete(`/teachings/${teaching.id}`).then(() => fetchTeachings());
                              toast.promise(promise, {
                                loading: 'Deleting teaching...',
                                success: 'Teaching deleted successfully!',
                                error: 'Failed to delete teaching!',
                              });
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-navy/30 hover:text-red-500 transition-colors"
                          title="Delete Teaching"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
