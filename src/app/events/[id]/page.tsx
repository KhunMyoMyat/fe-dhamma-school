"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react";
import Link from "next/link";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-navy pt-32 pb-20 text-white">
      <div className="container mx-auto px-4">
        <Link href="/events" className="flex items-center gap-2 text-gold hover:text-white transition-colors font-bold mb-12">
          <ArrowLeft className="size-5" /> Back to Events
        </Link>

        <div className="max-w-5xl">
          <Badge className="bg-gold/20 text-gold mb-6 border-gold/30">Upcoming Retreat</Badge>
          <h1 className="text-6xl font-black mb-10 leading-tight">
            Event Information <span className="text-gradient-gold">#{id}</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <Calendar className="size-8 text-gold mb-4" />
                <p className="text-xs text-cream/40 font-bold uppercase tracking-widest mb-1">Date & Time</p>
                <p className="text-xl font-bold">April 15, 2026</p>
             </div>
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <MapPin className="size-8 text-gold mb-4" />
                <p className="text-xs text-cream/40 font-bold uppercase tracking-widest mb-1">Location</p>
                <p className="text-xl font-bold">Yangon Peace Center</p>
             </div>
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <Share2 className="size-8 text-gold mb-4" />
                <p className="text-xs text-cream/40 font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-bold">Open for Registration</p>
             </div>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <h2 className="text-3xl font-bold text-gold mb-6">About this Event</h2>
            <p className="text-xl text-cream/70 leading-relaxed font-myanmar">
              ဤအခမ်းအနားနှင့် ပတ်သက်သည့် အသေးစိတ် အချက်အလက်များကို မကြာမီ အပြည့်အစုံ ဖော်ပြပေးပါမည်။
            </p>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="h-16 px-10 rounded-full bg-gold text-navy font-black hover:bg-white hover:scale-105 transition-all">
              Register Now
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-white/20 hover:border-gold">
              Inquire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
