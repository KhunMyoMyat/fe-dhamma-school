"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-navy pt-20">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Badge className="bg-gold/20 text-gold hover:bg-gold/30 mb-6 px-4 py-1.5 rounded-full border border-gold/40 tracking-widest uppercase text-xs font-bold">
            Sangha Gatherings
          </Badge>
          <h1 className="text-6xl font-black text-white mb-8 tracking-tight">
            Upcoming <span className="text-gradient-gold">Events</span>
          </h1>
          <p className="text-xl text-cream/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            သာသနာရေးဆိုင်ရာ အခမ်းအနားများနှင့် ဓမ္မသဘင်များ။
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-gold/10 rounded-[3rem] bg-white/5">
          <div className="size-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <Calendar className="size-12 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-cream mb-4">Events Calendar Coming Soon</h2>
          <p className="text-cream/40 text-center max-w-md">
            Stay tuned for a full schedule of upcoming meditation retreats and Buddhist festivities.
          </p>
        </div>
      </section>
    </div>
  );
}
