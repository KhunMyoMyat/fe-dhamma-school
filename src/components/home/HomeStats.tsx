"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ShieldCheck, Users, Heart, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/LanguageProvider";

const stats = [
  {
    icon: Sprout,
    id: "growth",
    color: "maroon",
  },
  {
    icon: ShieldCheck,
    id: "pure",
    color: "gold",
  },
  {
    icon: Users,
    id: "sangha",
    color: "navy",
  },
  {
    icon: Heart,
    id: "id",
    color: "saffron",
  },
];

export function HomeStats() {
  const { t, language } = useTranslation();
  const [selected, setSelected] = useState<null | (typeof stats)[0]>(null);

  return (
    <section className="relative z-30 -mt-16 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((v, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(v)}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 shadow-xl flex flex-col items-center text-center group cursor-pointer hover:border-gold transition-all"
          >
            <div
              className={`size-14 rounded-2xl bg-maroon/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <v.icon className="size-7 text-maroon" />
            </div>
            <h3 className="font-bold text-maroon mb-1 text-lg">
              {t(`home.values.items.${v.id}.label`)}
            </h3>
            <p className="text-xs text-navy/50 font-medium tracking-wide uppercase">
              {t(`home.values.items.${v.id}.text`)}
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-gold font-bold flex items-center gap-1">
                {t("home.values.discover")} <Sparkles className="size-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-navy/80 backdrop-blur-md z-100 cursor-zoom-out"
            />
            <motion.div
              layoutId={selected.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed inset-0 flex items-center justify-center z-101 p-4 pt-28 pointer-events-none"
            >
              <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-gold/30 pointer-events-auto relative max-h-[85vh] w-full max-w-xl flex flex-col overflow-hidden">
                <div className="absolute top-4 right-4 z-20">

                  <button
                    onClick={() => setSelected(null)}
                    className="size-10 rounded-full bg-cream/80 backdrop-blur-md flex items-center justify-center hover:bg-gold hover:text-navy transition-colors border border-gold/20"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-8 md:p-12 custom-scrollbar">
                  <div className="size-16 rounded-2xl bg-maroon/5 flex items-center justify-center mb-6">
                    <selected.icon className="size-8 text-maroon" />
                  </div>

                  <Badge className="bg-gold/10 text-gold mb-3 border-gold/20 px-3 py-0.5">
                    {t("home.values.badge")}
                  </Badge>

                  <h3 className="text-3xl font-black text-maroon mb-1 leading-tight">
                    {t(`home.values.items.${selected.id}.title`)}
                  </h3>
                  {language === "en" && (
                    <p className="text-xl font-black text-gold mb-6 font-myanmar">
                      {/* Optional: You can put a secondary language title here if needed, 
                          but since we use t(), it will switch automatically */}
                    </p>
                  )}

                  <div className="space-y-4">
                    <p className="text-base text-navy/70 leading-relaxed font-medium">
                      {t(`home.values.items.${selected.id}.description`)}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gold/10">
                    <Button
                      onClick={() => setSelected(null)}
                      className="w-full bg-maroon text-white hover:bg-gold hover:text-navy font-bold py-6 rounded-2xl transition-all shadow-lg shadow-maroon/10"
                    >
                      {t("home.values.back")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-widest uppercase border ${className}`}
    >
      {children}
    </span>
  );
}
