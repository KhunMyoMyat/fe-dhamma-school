"use client";

import { use, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Calendar, MapPin, Loader2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/10">
        <div className="flex flex-col items-center">
          <Loader2 className="size-12 text-gold animate-spin mb-4" />
          <p className="text-maroon font-bold uppercase tracking-widest text-xs">Loading Course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/10">
        <div className="text-center">
          <h2 className="text-3xl font-black text-maroon mb-4">Course Not Found</h2>
          <Link href="/courses">
            <Button variant="outline" className="border-gold text-maroon hover:bg-gold">
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/10 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/courses" className="flex items-center gap-2 text-maroon hover:text-gold transition-colors font-bold mb-12">
          <ArrowLeft className="size-5" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <div>
              <Badge className="bg-gold/10 text-gold mb-6 border border-gold/20 px-4 py-1 uppercase tracking-widest text-[10px] font-black">
                {course.level} Level
              </Badge>
              <h1 className="text-6xl font-black text-maroon mb-6 leading-[1.1]">
                {course.title}
              </h1>
              <h2 className="text-2xl font-myanmar text-gold-dark mb-10 leading-relaxed">
                {course.titleMm}
              </h2>
              
              <div className="prose prose-lg max-w-none text-navy/80 space-y-8">
                <p className="text-xl leading-relaxed">
                  {course.description}
                </p>
                <p className="text-xl leading-relaxed font-myanmar font-medium border-l-4 border-gold/30 pl-8 text-gold-dark">
                  {course.descriptionMm}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-white border border-gold/10 shadow-sm shadow-maroon/5 group hover:border-maroon transition-colors duration-500">
                <div className="size-14 rounded-2xl bg-cream flex items-center justify-center border border-gold/20 group-hover:bg-maroon group-hover:border-maroon transition-all duration-500">
                  <Clock className="size-6 text-maroon group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-dark/60 font-black uppercase tracking-[0.2em] mb-1">Duration</p>
                  <p className="font-bold text-navy text-lg">{course.duration || "Coming Soon"}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-white border border-gold/10 shadow-sm shadow-maroon/5 group hover:border-maroon transition-colors duration-500">
                <div className="size-14 rounded-2xl bg-cream flex items-center justify-center border border-gold/20 group-hover:bg-maroon group-hover:border-maroon transition-all duration-500">
                  <Users className="size-6 text-maroon group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-dark/60 font-black uppercase tracking-[0.2em] mb-1">Instructor</p>
                  <p className="font-bold text-navy text-lg">{course.teacher?.name || "Dhamma Teacher"}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-white border border-gold/10 shadow-sm shadow-maroon/5 group hover:border-maroon transition-colors duration-500">
                <div className="size-14 rounded-2xl bg-cream flex items-center justify-center border border-gold/20 group-hover:bg-maroon group-hover:border-maroon transition-all duration-500">
                  <Calendar className="size-6 text-maroon group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-dark/60 font-black uppercase tracking-[0.2em] mb-1">Schedule</p>
                  <p className="font-bold text-navy text-lg">
                    {course.daysOfWeek?.length > 0 ? course.daysOfWeek.join(', ') : "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-white border border-gold/10 shadow-sm shadow-maroon/5 group hover:border-maroon transition-colors duration-500">
                <div className="size-14 rounded-2xl bg-cream flex items-center justify-center border border-gold/20 group-hover:bg-maroon group-hover:border-maroon transition-all duration-500">
                  <MapPin className="size-6 text-maroon group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-dark/60 font-black uppercase tracking-[0.2em] mb-1">Availability</p>
                  <p className="font-bold text-navy text-lg">{course.isActive ? "Taking Enrollments" : "Starting Soon"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="bg-white p-8 rounded-[3.5rem] border border-gold/10 shadow-2xl shadow-maroon/10 overflow-hidden relative group">
              <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden mb-10 relative">
                 <Image 
                    src={course.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070"} 
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-linear-to-t from-maroon/60 via-transparent to-transparent opacity-60" />
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-maroon tracking-tight">Free Course</span>
                  <Badge variant="outline" className="text-gold border-gold font-bold">Dhamma Dāna</Badge>
                </div>
                <p className="text-navy/50 text-sm italic">This course is offered free of charge as part of our mission to share the Buddha's teachings.</p>
                
                <Button size="lg" className="w-full h-20 text-xl font-black bg-maroon hover:bg-gold text-white hover:text-navy rounded-[1.5rem] border-gold border-2 shadow-2xl shadow-maroon/30 transition-all active:scale-95">
                  Confirm Enrollment
                </Button>
                
                <div className="pt-6 text-center border-t border-gold/10">
                   <p className="text-xs font-bold text-gold-dark/60 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Star className="size-3 fill-gold text-gold" /> Limited Seats Available
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
