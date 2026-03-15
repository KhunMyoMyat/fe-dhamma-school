"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-cream/10 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/courses" className="flex items-center gap-2 text-maroon hover:text-gold transition-colors font-bold mb-12">
          <ArrowLeft className="size-5" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Badge className="bg-gold/10 text-gold mb-6">Level: Intermediate</Badge>
            <h1 className="text-5xl font-black text-maroon mb-6 leading-tight">
              Course Details for <span className="text-gradient-gold">#{id}</span>
            </h1>
            <p className="text-xl text-navy/70 leading-relaxed font-myanmar mb-12">
               သင်တန်း၏ အသေးစိတ်အချက်အလက်များကို မကြာမီ ဖော်ပြပေးပါမည်။
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/50 border border-gold/10">
                <Clock className="size-6 text-maroon" />
                <div>
                  <p className="text-xs text-navy/40 font-bold uppercase tracking-widest">Duration</p>
                  <p className="font-bold">12 Weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/50 border border-gold/10">
                <Users className="size-6 text-maroon" />
                <div>
                  <p className="text-xs text-navy/40 font-bold uppercase tracking-widest">Instructor</p>
                  <p className="font-bold">Ven. Sayadaw U Thuzana</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full md:w-fit h-16 px-12 text-xl font-black gradient-maroon text-white rounded-2xl border-2 border-gold shadow-xl">
              Confirm Enrollment
            </Button>
          </div>

          <div className="aspect-video bg-navy/5 rounded-[3rem] border-4 border-dashed border-gold/20 flex items-center justify-center">
             <BookOpen className="size-20 text-gold/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
