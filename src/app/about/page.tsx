"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/LanguageProvider";
import { BookOpen, Heart, Users, Globe } from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-cream/10 pt-20 pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div 
          {...fadeIn}
          className="max-w-4xl mx-auto mb-20"
        >
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 mb-6 px-6 py-1.5 rounded-full border border-gold/20 tracking-widest uppercase text-xs font-bold">
            {t("about.badge")}
          </Badge>

          <h1 className="text-6xl md:text-7xl font-black text-maroon tracking-tight mb-6">
            {t("about.title")} <span className="text-gradient-gold">{t("about.titleGold")}</span>
          </h1>
          
          <p className="text-xl text-navy/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </motion.div>
      </section>

      {/* History Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-linear-to-br from-gold/20 to-maroon/20 overflow-hidden border-2 border-gold/10 shadow-2xl">
              {/* Image Placeholder - In real use, would be a real photo */}
              <div className="w-full h-full flex items-center justify-center bg-maroon/5 group">
                <Globe className="size-32 text-gold/20 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 size-48 bg-white rounded-[2rem] shadow-xl border border-gold/10 p-6 flex flex-col justify-center items-center text-center">
              <span className="text-4xl font-black text-maroon">10+</span>
              <span className="text-xs font-bold text-gold uppercase tracking-widest mt-2">Years of Wisdom</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Badge className="bg-maroon/5 text-maroon border-maroon/10 px-4 py-1">History</Badge>
            <h2 className="text-4xl font-black text-maroon">{t("about.history.title")}</h2>
            <p className="text-navy/70 leading-relaxed text-lg font-myanmar">
              {t("about.history.text")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-maroon py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            {...fadeIn}
            className="text-center mb-20"
          >
            <Badge className="bg-white/10 text-gold border-white/20 mb-6 px-4 py-1">Philosophy</Badge>
            <h2 className="text-5xl font-black">{t("about.mission.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="size-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-8">
                <Heart className="size-7 text-gold" />
              </div>
              <h3 className="text-3xl font-black mb-6">{t("about.mission.missionTitle")}</h3>
              <p className="text-white/70 leading-relaxed font-myanmar text-lg">
                {t("about.mission.missionText")}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="size-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-8">
                <BookOpen className="size-7 text-gold" />
              </div>
              <h3 className="text-3xl font-black mb-6">{t("about.mission.visionTitle")}</h3>
              <p className="text-white/70 leading-relaxed font-myanmar text-lg">
                {t("about.mission.visionText")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values/Impact Quick Stats */}
      <section className="container mx-auto px-4 py-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Users, label: "Students", val: "500+" },
            { icon: Heart, label: "Monasteries", val: "12" },
            { icon: Globe, label: "Countries", val: "15" },
            { icon: BookOpen, label: "Courses", val: "40+" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gold/5 transition-colors"
            >
              <div className="size-12 rounded-full bg-maroon/5 flex items-center justify-center mb-4">
                <stat.icon className="size-6 text-maroon" />
              </div>
              <div className="text-3xl font-black text-maroon">{stat.val}</div>
              <div className="text-xs font-bold text-gold uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
