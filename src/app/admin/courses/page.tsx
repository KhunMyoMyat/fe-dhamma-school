"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 10;
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/courses", {
        params: {
          page,
          limit,
          search: search.trim(),
          sortBy,
          sortOrder
        }
      });
      setCourses(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | null) => {
    if (typeof id === "string") {
      setCourseToDelete(id);
      setIsDeleteModalOpen(true);
      return;
    }

    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/courses/${courseToDelete}`);
      toast.success("Course deleted successfully!");
      fetchCourses();
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      toast.error("Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, sortOrder]);

  const columns: Column<any>[] = [
    {
      id: "title",
      header: "Course Info",
      sortable: true,
      cell: (course) => (
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-xl relative overflow-hidden border border-gold/20 shrink-0">
            <Image 
              src={course.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=200"} 
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-black text-maroon text-lg leading-none mb-1">{course.title}</p>
            <p className="text-xs text-gold-dark font-myanmar font-medium">{course.titleMm}</p>
          </div>
        </div>
      )
    },
    {
      id: "teacherId",
      header: "Teacher",
      sortable: true,
      cell: (course) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-maroon/5 flex items-center justify-center">
            <User className="size-3 text-maroon" />
          </div>
          <span className="font-bold text-navy/70 text-sm">
            {course.teacher?.name || "Unassigned"}
          </span>
        </div>
      )
    },
    {
      id: "level",
      header: "Level",
      sortable: true,
      cell: (course) => (
        <Badge className="bg-maroon/5 text-maroon border-maroon/10 capitalize font-bold px-3 py-0.5">
          {course.level}
        </Badge>
      )
    },
    {
      id: "isActive",
      header: "Status",
      sortable: true,
      cell: (course) => (
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const newStatus = !course.isActive;
                await api.put(`/courses/${course.id}`, { isActive: newStatus });
                toast.success(`Course ${newStatus ? 'activated' : 'deactivated'} successfully!`);
                fetchCourses();
              } catch (error) {
                toast.error("Failed to update status.");
              }
            }}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 outline-none",
              course.isActive ? "bg-green-500" : "bg-navy/20"
            )}
          >
            <span className={cn(
              "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              course.isActive ? "translate-x-4" : "translate-x-0"
            )} />
          </button>
          <span className={cn(
            "text-xs font-black uppercase tracking-widest",
            course.isActive ? "text-green-600" : "text-navy/30"
          )}>
            {course.isActive ? "Active" : "Draft"}
          </span>
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      hideable: false,
      cell: (course) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/courses/${course.id}`} target="_blank">
            <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="View on Site">
              <Eye className="size-5" />
            </button>
          </Link>
          <Link href={`/admin/courses/${course.id}`}>
            <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="Edit Course">
              <Edit2 className="size-5" />
            </button>
          </Link>
          <button 
            onClick={() => handleDelete(course.id)}
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
            Courses <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            သင်တန်းများကို စီမံခန့်ခွဲရန် နေရာ (စုစုပေါင်း - {total} ခု)
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Course
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="သင်တန်းအမည်ဖြင့် ရှာဖွေပါ..."
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
        title="Delete Course"
        description="Are you sure you want to delete this course? This will permanently remove all related materials and student progress."
        variant="danger"
        confirmText="Yes, Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
