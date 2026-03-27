"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "@/providers/LanguageProvider";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-navy/60 to-transparent z-10" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-cream/20 to-transparent z-10" />
        <Image
          src="/images/hero/pagoda-main.png"
          alt="Myanmar Golden Pagoda"
          fill
          className="object-cover scale-105 animate-pulse-slow"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-sm">
              {t("home.hero.badge")}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.05] tracking-tight">
            {t("home.hero.title")}{" "}
            <span className="text-gradient-gold">
              {t("home.hero.titleGold")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cream/90 mb-12 leading-relaxed font-myanmar max-w-2xl text-balance">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/teachings">
              <Button
                size="lg"
                className="gradient-maroon text-white h-16 px-10 text-xl border-2 border-gold shadow-2xl shadow-maroon/40 hover:scale-105 transition-all rounded-full group"
              >
                {t("nav.teachings")}{" "}
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="glass-card text-gold h-16 px-10 text-xl border-2 border-gold/50 hover:bg-gold hover:text-navy transition-all rounded-full"
              >
                {t("nav.events")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">
          {t("common.scroll")}
        </span>
        <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
