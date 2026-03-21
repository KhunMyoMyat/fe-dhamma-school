"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/providers/LanguageProvider";

export default function DonatePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto mb-20">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-6 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            {t("donate.badge")}
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black text-maroon mb-8 tracking-tight">
            {t("donate.title").split(' ').slice(0, -1).join(' ')} <span className="text-gradient-gold">{t("donate.title").split(' ').pop()}</span>
          </h1>
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            {t("footer.quote")}
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/monthly-donors">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-full border-gold/40 text-gold hover:bg-gold hover:text-navy font-black tracking-tight"
              >
                {t("donate.viewMonthly")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { amount: "$10", label: t("donate.tiers.supporter"), text: t("donate.tiers.supporterText") },
            { amount: "$25", label: t("donate.tiers.patron"), text: t("donate.tiers.patronText") },
            { amount: "$100", label: t("donate.tiers.guardian"), text: t("donate.tiers.guardianText") },
          ].map((tier, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-12 rounded-[3rem] border-2 border-gold/10 bg-cream/5 hover:bg-white hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 flex flex-col items-center text-center group"
            >
              <div className="size-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="size-8 text-gold fill-gold/20" />
              </div>
              <h3 className="text-4xl font-black text-maroon mb-2">{tier.amount}</h3>
              <p className="text-gold font-bold mb-4">{tier.label}</p>
              <p className="text-sm text-navy/40 mb-10">{tier.text}</p>
              <Button className="w-full bg-maroon hover:bg-gold text-white rounded-2xl py-8 font-black text-xl transition-all">
                {t("donate.select")}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-navy rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 border-4 border-gold/30">
          <div className="text-left">
            <h2 className="text-3xl font-black text-gold mb-4">{t("donate.otherWays")}</h2>
            <p className="text-cream/50 max-w-md">
              {t("donate.otherWaysDesc")}
            </p>
          </div>
          <Button variant="outline" className="h-16 px-10 rounded-full border-gold/50 text-gold hover:bg-gold hover:text-navy font-bold">
            {t("donate.contact")}
          </Button>
        </div>
      </section>
    </div>
  );
}
