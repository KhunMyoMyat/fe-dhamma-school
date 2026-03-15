"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Loader2,
  BookOpen,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/courses");
      // Handle paginated response: { data: [...], meta: {...} }
      setCourses(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.titleMm?.includes(search)
  );

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Courses <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            သင်တန်းများကို စီမံခန့်ခွဲရန် နေရာ (စုစုပေါင်း - {courses.length} ခု)
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Course
          </Button>
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gold/10 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/20 group-focus-within:text-maroon transition-colors" />
          <input 
            type="text"
            placeholder="သင်တန်းအမည်ဖြင့် ရှာဖွေပါ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-cream/30 border-none rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-maroon/20 outline-none font-myanmar font-medium"
          />
        </div>
        <Button variant="outline" className="h-12 border-gold/20 rounded-xl px-6 font-bold text-navy/60">
          Filter
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-navy/20">
            <BookOpen className="size-12" />
            <p className="font-bold font-myanmar">ရှာဖွေမှု မတွေ့ရှိပါ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 border-b border-gold/10">
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Course Info</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Teacher & Schedule</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Level</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="group hover:bg-cream/20 transition-colors">
                    <td className="p-6">
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
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-3">
                        {/* Teacher */}
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-maroon/5 flex items-center justify-center">
                            <Plus className="size-3 text-maroon" />
                          </div>
                          <span className="font-bold text-navy/70 text-sm">
                            {course.teacher?.name || "Unassigned"}
                          </span>
                        </div>
                        
                        {/* Schedule Details */}
                        <div className="flex flex-col pl-2 border-l-2 border-gold/20">
                          <div className="flex items-center gap-1.5 text-navy/80 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                            <Calendar className="size-3 text-gold" />
                            {course.startDate ? new Date(course.startDate).toLocaleDateString() : "TBA"}
                          </div>
                          <div className="font-bold text-maroon text-[11px] mb-0.5">
                            {course.daysOfWeek?.length > 0 ? course.daysOfWeek.map((d: any) => d.substring(0, 3)).join(', ') : "No days set"}
                          </div>
                          {course.classTime && <span className="text-[10px] text-navy/40 font-medium">{course.classTime}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-maroon/5 text-maroon border-maroon/10 capitalize font-bold px-3 py-0.5">
                        {course.level}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-2 rounded-full",
                          course.isActive ? "bg-green-500 animate-pulse" : "bg-navy/20"
                        )} />
                        <span className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          course.isActive ? "text-green-600" : "text-navy/30"
                        )}>
                          {course.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
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
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this course?")) {
                              // Delete logic here
                              api.delete(`/courses/${course.id}`).then(() => fetchCourses());
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-navy/30 hover:text-red-500 transition-colors" 
                          title="Delete Course"
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
