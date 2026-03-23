"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Coffee, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/providers/LanguageProvider";
import DonationMethods from "@/components/home/DonationMethods";
import SubmitDonationForm from "@/components/donate/SubmitDonationForm";

const impactItems = [
  {
    icon: BookOpen,
    id: "books",
  },
  {
    icon: Coffee,
    id: "meals",
  },
  {
    icon: Globe,
    id: "tech",
  },
];

export default function DonatePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream/10 pt-20 pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto mb-10">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-6 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            {t("donate.badge")}
          </Badge>

          <div className="text-6xl md:text-7xl font-black text-maroon tracking-tight">
            <h1>{t("donate.title").split(" ").slice(0, -1).join(" ")}</h1>
            <h2 className="text-gradient-gold mt-5">
              {t("donate.title").split(" ").pop()}
            </h2>
          </div>
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            {t("footer.quote")}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/monthly-donors">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-full border-gold/40 text-gold hover:bg-gold hover:text-navy font-black tracking-tight transition-all"
              >
                {t("donate.viewMonthly")}
              </Button>
            </Link>
          </div>
        </div>
        <DonationMethods />
        <SubmitDonationForm />

        {/* Impact Section */}
        <div className="max-w-6xl mx-auto mb-10 mt-10">
          <div className="flex flex-col items-center mb-16 px-4">
            <Badge className="bg-maroon/5 text-maroon border-maroon/10 mb-4 px-4 py-1">
              Impact
            </Badge>
            <h2 className="text-4xl font-black text-maroon text-center">
              {t("donate.impact.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactItems.map((item, i) => (
              <div
                key={i}
                className="p-10 rounded-[2.5rem] bg-linear-to-b from-white to-cream/30 border border-gold/10 text-center flex flex-col items-center"
              >
                <div className="size-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <item.icon className="size-7 text-gold" />
                </div>
                <h4 className="text-xl font-bold text-maroon mb-3">
                  {t(`donate.impact.${item.id}`)}
                </h4>
                <p className="text-sm text-navy/60 leading-relaxed">
                  {t(`donate.impact.${item.id}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
          {[
            {
              amount: "$10",
              label: t("donate.tiers.supporter"),
              text: t("donate.tiers.supporterText"),
            },
            {
              amount: "$25",
              label: t("donate.tiers.patron"),
              text: t("donate.tiers.patronText"),
            },
            {
              amount: "$100",
              label: t("donate.tiers.guardian"),
              text: t("donate.tiers.guardianText"),
            },
          ].map((tier, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] border-2 border-gold/10 bg-white/70 backdrop-blur-md hover:bg-white hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 flex flex-col items-center text-center group"
            >
              <div className="size-16 rounded-2xl bg-maroon/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="size-8 text-maroon fill-maroon/10" />
              </div>
              <h3 className="text-4xl font-black text-maroon mb-2">
                {tier.amount}
              </h3>
              <p className="text-gold font-bold mb-4">{tier.label}</p>
              <p className="text-sm text-navy/40 mb-10 leading-relaxed">
                {tier.text}
              </p>
              <Button className="w-full h-14 bg-maroon hover:bg-gold text-white rounded-2xl font-black text-lg transition-all">
                {t("donate.select")}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
