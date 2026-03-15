"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-cream/10 pt-20">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-4 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            Education for Enlightenment
          </Badge>
          <h1 className="text-6xl font-black text-maroon mb-8 tracking-tight">
            Our <span className="text-gradient-gold">Dhamma Courses</span>
          </h1>
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            မြတ်ဗုဒ္ဓ၏ တရားတော်များကို စနစ်တကျ လေ့လာသင်ယူနိုင်ရန်အတွက် ဖွင့်လှစ်ထားသော သင်တန်းများ။
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-gold/20 rounded-[3rem] bg-white/50 backdrop-blur-sm">
          <div className="size-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <BookOpen className="size-12 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-maroon mb-4">Courses List Coming Soon</h2>
          <p className="text-navy/50 text-center max-w-md">
            We are currently updating our course catalog with new spiritual teachings and meditation guides.
          </p>
        </div>
      </section>
    </div>
  );
}
