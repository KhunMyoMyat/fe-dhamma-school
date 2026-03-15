"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

import { useTranslation } from "@/providers/LanguageProvider";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/active");
        setCourses(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-cream/10 pt-20">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-4 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            {t("home.hero.badge")}
          </Badge>
          <h1 className="text-6xl font-black text-maroon mb-8 tracking-tight">
            {t("courses.title")}
          </h1>
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            {t("courses.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-32">
            <Loader2 className="size-12 text-gold animate-spin mb-4" />
            <p className="text-navy/50 font-bold uppercase tracking-widest text-xs">Loading Sacred Teachings...</p>
          </div>
        ) : courses.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {courses.map((course: any) => (
              <motion.div key={course.id} variants={item}>
                <Card className="h-full group hover:shadow-2xl hover:shadow-maroon/10 border-ornament transition-all duration-700 overflow-hidden bg-white/70 backdrop-blur-md rounded-[2.5rem] py-0 gap-0 border-none ring-0">
                  <div className="aspect-4/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-maroon/20 group-hover:bg-transparent transition-colors z-10" />
                    <Image
                      src={
                        course.image ||
                        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070"
                      }
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <Badge className="absolute top-6 left-6 z-20 bg-white/90 text-maroon backdrop-blur-md border border-gold/30 font-bold px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                      {course.level}
                    </Badge>
                  </div>
                  <CardContent className="p-10">
                    <h3 className="text-2xl font-bold text-maroon mb-2 group-hover:text-gold transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm font-myanmar text-gold-dark mb-8 font-medium">
                      {course.titleMm}
                    </p>

                    <div className="flex flex-col gap-4 text-sm text-navy/70 mb-10">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                          <Calendar className="size-4 text-maroon" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black tracking-widest text-gold-dark/60 leading-none mb-1">{t("courses.startsOn")}</span>
                          <span className="font-semibold text-navy/90">
                            {course.startDate ? new Date(course.startDate).toLocaleDateString(language === 'en' ? 'en-GB' : language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : t("common.tba")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                          <BookOpen className="size-4 text-maroon" />
                        </div>
                        <span className="font-semibold">{course.duration || t("common.comingSoon")}</span>
                      </div>

                      {course.daysOfWeek?.length > 0 && (
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                            <ArrowRight className="size-4 text-maroon" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-gold-dark/60 leading-none mb-1">{t("courses.schedule")}</span>
                            <span className="font-semibold text-navy/90 text-[13px]">
                              {course.daysOfWeek.map((d: string) => d.substring(0, 3)).join(', ')} • {course.classTime}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                          <Users className="size-4 text-maroon" />
                        </div>
                        <span className="font-semibold text-navy/90">
                          {course.teacher?.name || t("courses.instructor")}
                        </span>
                      </div>
                    </div>

                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full bg-cream hover:bg-gold hover:text-navy text-maroon border-2 border-gold/30 transition-all font-black py-6 rounded-2xl shadow-sm">
                        {t("courses.enroll")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-gold/20 rounded-[3rem] bg-white/50 backdrop-blur-sm">
            <div className="size-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
              <BookOpen className="size-12 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-maroon mb-4">{t("courses.noCourses")}</h2>
            <p className="text-navy/50 text-center max-w-md">
              {t("courses.subtitle")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
