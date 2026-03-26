"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useTranslation } from "@/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PlayCircle, User, BookOpen, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, language } = useTranslation();

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ["course-public", id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-maroon border-t-transparent rounded-full mx-auto mb-4 shadow-lg shadow-maroon/20" />
          <p className="text-maroon font-black uppercase tracking-widest">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    router.push("/courses");
    return null;
  }

  // Extract YouTube ID from URL if exists
  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(course.videoUrl);

  return (
    <div className="min-h-screen bg-cream/20 pt-32 pb-32 lotus-pattern">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/courses">
          <Button variant="ghost" className="mb-8 text-maroon hover:text-gold group font-black uppercase tracking-widest p-0">
            <ArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" />
            {t("common.back")}
          </Button>
        </Link>

        {/* Course Header */}
        <div className="mb-12">
          <Badge className="bg-maroon/10 text-maroon hover:bg-maroon/20 mb-6 px-6 py-2 border border-maroon/20 font-black tracking-widest uppercase">
            {t("courses.videoClass")}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black text-maroon mb-6 tracking-tight">
            {course.title}
          </h1>
          <p className="text-xl md:text-2xl text-gold-dark font-myanmar max-w-3xl leading-relaxed">
            {course.titleMm}
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16 rounded-[3rem] overflow-hidden shadow-2xl shadow-maroon/20 border-4 border-gold/20 aspect-video relative group">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full bg-navy/90 flex flex-col items-center justify-center text-gold text-center p-12">
              <PlayCircle className="size-24 mb-6 opacity-40" />
              <p className="text-2xl font-black uppercase tracking-[0.2em]">{t("common.comingSoon")}</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white/80 backdrop-blur-md p-12 rounded-[3.5rem] border border-gold/10 shadow-xl shadow-maroon/5">
              <h2 className="text-3xl font-black text-maroon mb-8 flex items-center gap-4 uppercase">
                <BookOpen className="size-8 text-gold" />
                Course Details
              </h2>
              <div className="prose prose-lg prose-maroon max-w-none">
                <p className="whitespace-pre-wrap text-navy/80 font-medium font-myanmar">
                  {course.descriptionMm || course.description}
                </p>
                {course.descriptionMm && course.description && (
                  <>
                    <hr className="my-8 border-gold/20" />
                    <p className="whitespace-pre-wrap text-navy/60 font-medium">
                      {course.description}
                    </p>
                  </>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
            {/* Instructor Card */}
            <Card className="rounded-[3rem] overflow-hidden border-none shadow-2xl shadow-maroon/10 bg-white/70 backdrop-blur-md p-2">
              <div className="aspect-square relative overflow-hidden rounded-[2.5rem]">
                <Image
                  src={course.teacher?.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000"}
                  alt={course.teacher?.name || "Teacher"}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-8 text-center">
                <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/20 mb-4 px-4 py-1 uppercase font-black text-[10px] tracking-widest">
                  {t("courses.instructor")}
                </Badge>
                <h3 className="text-2xl font-black text-maroon mb-2">{course.teacher?.name}</h3>
                <p className="text-sm font-myanmar text-gold-dark font-medium">{course.teacher?.nameMm}</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="bg-maroon/90 text-white p-10 rounded-[3rem] shadow-2xl shadow-maroon/20 space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Badge className="bg-gold text-navy hover:bg-gold px-3 font-black text-[10px]">{course.level}</Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60 m-0">{t("courses.level")}</p>
                  <p className="text-lg font-bold capitalize m-0">{course.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="size-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                   <Clock className="size-6 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60 m-0">{t("courses.duration")}</p>
                  <p className="text-lg font-bold m-0">{course.duration || "Self-paced"}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
