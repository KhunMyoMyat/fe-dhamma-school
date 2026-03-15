"use client";

import { motion } from "framer-motion";
import { Sprout, ShieldCheck, Users, Heart } from "lucide-react";

const stats = [
  { icon: Sprout, label: "Growth", text: "Spiritual Development" },
  { icon: ShieldCheck, label: "Pure", text: "Authentic Teachings" },
  { icon: Users, label: "Sangha", text: "Global Community" },
  { icon: Heart, label: "Dana", text: "Generous Support" },
];

export function HomeStats() {
  return (
    <section className="relative z-30 -mt-16 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((v, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 shadow-xl flex flex-col items-center text-center group"
          >
            <div className="size-12 rounded-2xl bg-maroon/5 flex items-center justify-center mb-4 group-hover:bg-maroon transition-colors">
              <v.icon className="size-6 text-maroon group-hover:text-gold transition-colors" />
            </div>
            <h3 className="font-bold text-maroon mb-1">{v.label}</h3>
            <p className="text-xs text-navy/50">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
