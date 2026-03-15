"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/providers/LanguageProvider";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/upcoming");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-navy pt-20">
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <Badge className="bg-gold/20 text-gold hover:bg-gold/30 mb-6 px-4 py-1.5 rounded-full border border-gold/40 tracking-widest uppercase text-xs font-bold">
            {t("home.events.title")}
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight">
            {t("events.title")}
          </h1>
          <div className="h-1.5 w-32 gradient-gold mx-auto mb-8 rounded-full" />
          <p className="text-xl md:text-2xl text-cream/70 leading-relaxed font-myanmar max-w-2xl mx-auto">
            {t("events.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-32">
            <Loader2 className="size-12 text-gold animate-spin mb-4" />
            <p className="text-cream/40 font-bold uppercase tracking-widest text-xs">Loading Events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {events.map((event: any, i: number) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={event.id}
                className="bg-white/5 border border-white/10 p-2 flex flex-col md:flex-row group hover:bg-white/10 hover:border-gold/30 transition-all rounded-[2.5rem] overflow-hidden backdrop-blur-sm"
              >
                <div className="relative w-full md:w-2/5 aspect-4/3 md:aspect-auto">
                  <Image
                    src={event.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4 bg-maroon/90 backdrop-blur-md text-white font-black px-5 py-3 rounded-2xl text-center shadow-2xl border border-gold/30">
                    <span className="block text-3xl leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] uppercase font-black tracking-widest mt-1">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="size-4 text-gold" />
                    <span className="text-xs font-black uppercase tracking-widest text-gold-light/60">
                      {event.location}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-gold transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-lg font-myanmar text-cream/70 mb-4 line-clamp-2">
                    {language === "mm" ? event.titleMm : (event.description || event.title)}
                  </p>

                  {(event.mainSponsor || event.mainSponsorMm) && (
                    <div className="bg-gold/10 rounded-xl p-4 border border-gold/20 mb-8">
                      <p className="text-[10px] uppercase font-black tracking-widest text-gold/60 mb-1">Main Sponsor</p>
                      <p className="text-sm font-bold text-gold font-myanmar">
                        {language === "mm" ? (event.mainSponsorMm || event.mainSponsor) : (event.mainSponsor || event.mainSponsorMm)}
                      </p>
                    </div>
                  )}

                  <Link href={`/events/${event.id}`}>
                    <Button
                      variant="outline"
                      className="w-full md:w-fit border-white/20 hover:border-gold text-white hover:bg-gold hover:text-navy rounded-2xl px-8 h-14 font-black transition-all group"
                    >
                      {t("events.details")} <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-gold/10 rounded-[3rem] bg-white/5 max-w-4xl mx-auto">
            <div className="size-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
              <Calendar className="size-12 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-cream mb-4">{t("common.comingSoon")}</h2>
            <p className="text-cream/40 text-center max-w-md">
              {t("events.subtitle")}
            </p>
          </div>
        )}
      </section>
      
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
