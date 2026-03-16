"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Calendar } from "lucide-react";
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

export function FeaturedCourses({ courses }: { courses: any[] }) {
  const { t, language } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-32 lotus-pattern">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6">
        <div>
          <Badge className="bg-maroon/10 text-maroon hover:bg-maroon/20 mb-5 px-4 py-2">
            {t("home.featured.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-maroon mb-6 tracking-tight">
            {t("home.featured.title")}{" "}
            <span className="text-gold">{t("home.featured.titleGold")}</span>
          </h2>
          <p className="text-lg md:text-xl text-gold-dark font-myanmar">
            {t("home.featured.subtitle")}
          </p>
        </div>
        <Link href="/courses">
          <Button
            variant="ghost"
            className="text-maroon hover:text-gold group font-bold text-lg"
          >
            {t("common.viewAll")}{" "}
            <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Button>
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {courses?.map((course: any) => (
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
                      <span className="text-[10px] uppercase font-black tracking-widest text-gold-dark/60 leading-none mb-1">
                        {t("courses.startsOn")}
                      </span>
                      <span className="font-semibold text-navy/90">
                        {course.startDate
                          ? new Date(course.startDate).toLocaleDateString(
                              language === "en"
                                ? "en-GB"
                                : language === "th"
                                  ? "th-TH"
                                  : "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : t("common.tba")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                      <BookOpen className="size-4 text-maroon" />
                    </div>
                    <span className="font-semibold">{course.duration}</span>
                  </div>

                  {course.daysOfWeek?.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                        <ArrowRight className="size-4 text-maroon" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gold-dark/60 leading-none mb-1">
                          {t("courses.schedule")}
                        </span>
                        <span className="font-semibold text-navy/90 text-[13px]">
                          {course.daysOfWeek
                            .map((d: string) => d.substring(0, 3))
                            .join(", ")}{" "}
                          • {course.classTime}
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
    </section>
  );
}
