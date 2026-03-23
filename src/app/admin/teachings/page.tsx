"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileText,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { resolveFileUrl } from "@/lib/fileUrl";
import { pickTranslation } from "@/lib/translations";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminTeachingsPage() {
  const [teachings, setTeachings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 10;
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teachingToDelete, setTeachingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTeachings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/teachings", {
        params: {
          page,
          limit,
          search: search.trim(),
          sortBy,
          sortOrder
        }
      });
      setTeachings(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching teachings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | null) => {
    if (typeof id === "string") {
      setTeachingToDelete(id);
      setIsDeleteModalOpen(true);
      return;
    }

    if (!teachingToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/teachings/${teachingToDelete}`);
      toast.success("Teaching deleted successfully!");
      fetchTeachings();
      setIsDeleteModalOpen(false);
      setTeachingToDelete(null);
    } catch (error) {
      toast.error("Failed to delete teaching.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeachings();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, sortOrder]);

  const columns: Column<any>[] = [
    {
      id: "title",
      header: "Teaching",
      sortable: false, // Sorting by translation is complex in DB
      cell: (teaching) => {
        const translation = pickTranslation(teaching.translations);
        return (
          <div>
            <p className="font-black text-maroon text-lg leading-none mb-1">
              {translation?.title || "Untitled"}
            </p>
            {translation?.locale && (
              <p className="text-xs text-gold-dark font-bold uppercase tracking-widest">
                {translation.locale}
              </p>
            )}
          </div>
        );
      }
    },
    {
      id: "category",
      header: "Category",
      sortable: true,
      cell: (teaching) => (
        <Badge className="bg-maroon/5 text-maroon border-maroon/10 capitalize font-bold px-3 py-0.5">
          {teaching.category || "dhamma"}
        </Badge>
      )
    },
    {
      id: "teacherId",
      header: "Teacher",
      sortable: true,
      cell: (teaching) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-maroon/5 flex items-center justify-center">
            <BookOpen className="size-3 text-maroon" />
          </div>
          <span className="font-bold text-navy/70 text-sm">
            {teaching.teacher?.name || "Unassigned"}
          </span>
        </div>
      )
    },
    {
      id: "documentUrl",
      header: "Document",
      cell: (teaching) => teaching.documentUrl ? (
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
      )
    },
    {
      id: "isPublished",
      header: "Status",
      sortable: true,
      cell: (teaching) => (
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const newStatus = !teaching.isPublished;
                await api.put(`/teachings/${teaching.id}`, { isPublished: newStatus });
                toast.success(`Status updated!`);
                fetchTeachings();
              } catch (error) {
                toast.error("Failed to update status.");
              }
            }}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 outline-none",
              teaching.isPublished ? "bg-green-500" : "bg-navy/20"
            )}
          >
            <span className={cn(
              "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              teaching.isPublished ? "translate-x-4" : "translate-x-0"
            )} />
          </button>
          <span className={cn(
            "text-xs font-black uppercase tracking-widest",
            teaching.isPublished ? "text-green-600" : "text-navy/30"
          )}>
            {teaching.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      hideable: false,
      cell: (teaching) => (
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
            onClick={() => handleDelete(teaching.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-navy/30 hover:text-red-500 transition-colors"
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Teachings <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-medium">
            Manage teachings and resources (Total - {total})
          </p>
        </div>
        <Link href="/admin/teachings/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Teaching
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={teachings}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search teachings..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(f, o) => { setSortBy(f); setSortOrder(o); }}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />
 
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(null)}
        title="Delete Teaching"
        description="Are you sure you want to delete this teaching material? This will remove the document and all its translations from the site."
        variant="danger"
        confirmText="Yes, Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
