"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useTranslation } from "@/providers/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, User, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const { t, language } = useTranslation();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses-public"],
    queryFn: async () => {
      const { data } = await api.get("/courses/active");
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-cream/20 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-maroon mb-4 tracking-tight">
              {t("courses.title")}
            </h1>
            <p className="text-lg text-gold-dark font-myanmar max-w-2xl">
              {t("courses.subtitle")}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-gold/30 text-maroon hover:bg-gold/10">
              <ArrowLeft className="mr-2 size-4" /> {t("common.back")}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin size-10 border-4 border-maroon border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gold-dark font-bold">{t("common.loading")}</p>
          </div>
        ) : courses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course: any) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/70 backdrop-blur-md rounded-[2.5rem] border-none">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={course.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <Badge className="absolute top-6 left-6 z-20 bg-white/90 text-maroon backdrop-blur-md border border-gold/30 font-bold px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                      {t("courses.videoClass")}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-maroon mb-2 group-hover:text-gold transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm font-myanmar text-gold-dark mb-6 font-medium">
                      {course.titleMm}
                    </p>

                    <div className="flex items-center gap-3 text-navy/70 mb-8">
                      <div className="size-8 rounded-full bg-maroon/5 flex items-center justify-center">
                        <User className="size-4 text-maroon" />
                      </div>
                      <span className="font-semibold text-sm">
                        {course.teacher?.name || t("courses.instructor")}
                      </span>
                    </div>

                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full h-12 gradient-maroon text-white hover:shadow-lg transition-all font-bold rounded-xl space-x-2">
                        <PlayCircle className="size-5" />
                        <span>{t("courses.view")}</span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gold/20">
            <BookOpen className="size-16 text-gold/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-maroon mb-2">{t("courses.noCourses")}</h3>
            <p className="text-navy/50">{t("courses.noCoursesDesc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
