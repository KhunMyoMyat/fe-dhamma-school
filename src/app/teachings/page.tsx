"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sprout } from "lucide-react";

export default function TeachingsPage() {
  return (
    <div className="min-h-screen bg-cream/10 pt-20">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Badge className="bg-maroon/10 text-maroon hover:bg-maroon/20 mb-6 px-4 py-1.5 rounded-full border border-maroon/20 tracking-widest uppercase text-xs font-bold">
            Wisdom Library
          </Badge>
          <h1 className="text-6xl font-black text-maroon mb-8 tracking-tight">
            Sacred <span className="text-gradient-gold">Teachings</span>
          </h1>
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            မြတ်ဗုဒ္ဓ၏ ဒေသနာတော်များကို အခမဲ့ ဖတ်ရှုလေ့လာနိုင်သော နေရာ။
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-maroon/10 rounded-[3rem] bg-white/50 backdrop-blur-sm">
          <div className="size-24 bg-maroon/5 rounded-full flex items-center justify-center mb-8">
            <Sprout className="size-12 text-maroon animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-maroon mb-4">Dhamma Articles Coming Soon</h2>
          <p className="text-navy/50 text-center max-w-md">
            Our library of sacred texts and wise reflections is currently being indexed for better wisdom discovery.
          </p>
        </div>
      </section>
    </div>
  );
}
