"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Sparkles, BookOpen, Coffee, Globe, Building2, QrCode, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/providers/LanguageProvider";

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

const bankAccounts = [
  {
    bank: "kbz",
    name: "Dhamma School Foundation",
    number: "123-456-789012",
    type: "Savings",
  },
  {
    bank: "cb",
    name: "Dhamma School Foundation",
    number: "987-654-321098",
    type: "Current",
  },
  {
    bank: "aya",
    name: "Dhamma School Foundation",
    number: "555-444-333222",
    type: "Savings",
  },
];

export default function DonatePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream/10 pt-20 pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto mb-20">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-6 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            {t("donate.badge")}
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black text-maroon mb-8 tracking-tight">
            {t("donate.title").split(' ').slice(0, -1).join(' ')} <span className="text-gradient-gold">{t("donate.title").split(' ').pop()}</span>
          </h1>
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

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
          {[
            { amount: "$10", label: t("donate.tiers.supporter"), text: t("donate.tiers.supporterText") },
            { amount: "$25", label: t("donate.tiers.patron"), text: t("donate.tiers.patronText") },
            { amount: "$100", label: t("donate.tiers.guardian"), text: t("donate.tiers.guardianText") },
          ].map((tier, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] border-2 border-gold/10 bg-white/70 backdrop-blur-md hover:bg-white hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 flex flex-col items-center text-center group"
            >
              <div className="size-16 rounded-2xl bg-maroon/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="size-8 text-maroon fill-maroon/10" />
              </div>
              <h3 className="text-4xl font-black text-maroon mb-2">{tier.amount}</h3>
              <p className="text-gold font-bold mb-4">{tier.label}</p>
              <p className="text-sm text-navy/40 mb-10 leading-relaxed">{tier.text}</p>
              <Button className="w-full h-14 bg-maroon hover:bg-gold text-white rounded-2xl font-black text-lg transition-all">
                {t("donate.select")}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="flex flex-col items-center mb-16 px-4">
            <Badge className="bg-maroon/5 text-maroon border-maroon/10 mb-4 px-4 py-1">Impact</Badge>
            <h2 className="text-4xl font-black text-maroon text-center">{t("donate.impact.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactItems.map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-linear-to-b from-white to-cream/30 border border-gold/10 text-center flex flex-col items-center">
                <div className="size-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <item.icon className="size-7 text-gold" />
                </div>
                <h4 className="text-xl font-bold text-maroon mb-3">{t(`donate.impact.${item.id}`)}</h4>
                <p className="text-sm text-navy/60 leading-relaxed">{t(`donate.impact.${item.id}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Transfer Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-maroon rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-maroon/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="text-left">
                <div className="flex items-center gap-4 mb-8">
                  <div className="size-12 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <Building2 className="size-6 text-gold" />
                  </div>
                  <h2 className="text-4xl font-black text-white leading-tight">{t("donate.bank.title")}</h2>
                </div>
                
                <div className="space-y-6">
                  {bankAccounts.map((acc, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <p className="text-xs font-black text-gold/60 uppercase tracking-[0.2em] mb-2">{t(`donate.bank.${acc.bank}`)}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-lg font-bold text-white mb-1">{acc.name}</p>
                          <p className="text-2xl font-black text-gold font-mono">{acc.number}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-8 rounded-[3rem] bg-white text-maroon shadow-2xl relative w-full max-w-sm">
                  <div className="absolute -top-4 -right-4 size-16 bg-gold rounded-2xl flex items-center justify-center rotate-12 shadow-xl border-4 border-white">
                    <QrCode className="size-8 text-maroon" />
                  </div>
                  <p className="text-xs font-black text-navy/40 uppercase tracking-widest text-center mb-6">{t("donate.bank.scan")} (KBZPay)</p>
                  <div className="aspect-square relative mb-8 rounded-2xl overflow-hidden border-2 border-cream">
                    <Image
                      src="/images/donation/kbzpay_qr.png"
                      alt="KBZPay QR Code"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button className="w-full bg-maroon text-white h-14 rounded-2xl font-black hover:bg-navy transition-all">
                    {t("donate.contact")}
                  </Button>
                </div>
                
                <div className="mt-8 flex items-start gap-3 text-cream/60 max-w-xs text-left">
                  <Info className="size-5 shrink-0 mt-0.5 text-gold" />
                  <p className="text-xs leading-relaxed font-medium">
                    {t("donate.otherWaysDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

