"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

import Link from "next/link";
import { useTranslation } from "@/providers/LanguageProvider";

export function CallToAction() {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 pt-32">
      <div className="gradient-hero rounded-[4rem] p-12 md:p-32 flex flex-col items-center text-center relative overflow-hidden text-white border-8 border-gold/30 shadow-[0_50px_100px_rgba(128,0,32,0.4)]">
        <div className="absolute inset-0 opacity-10 animate-pulse-slow">
          <div className="absolute top-10 left-10 size-40 border border-gold/20 rounded-full spin-slow" />
          <div className="absolute bottom-20 right-20 size-64 border border-gold/20 rounded-full animate-spin-slow" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="size-20 gradient-gold rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
            <Star className="size-10 text-maroon" />
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-balance">
            {t("home.cta.title")} <br />{" "}
            <span className="text-gradient-gold">{t("home.cta.titleGold")}</span>
          </h2>

          <p className="text-xl md:text-2xl text-cream/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed font-myanmar text-balance">
            {t("home.cta.subtitle")}
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-gold text-navy h-20 px-12 text-2xl font-black hover:bg-white hover:scale-105 transition-all rounded-full border-4 border-gold shadow-2xl group"
              >
                {t("home.cta.button")}{" "}
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <span className="text-cream/50 font-bold uppercase tracking-widest text-sm">
              {t("home.cta.footer")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

