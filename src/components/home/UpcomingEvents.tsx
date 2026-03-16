"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import Link from "next/link";

import { useTranslation } from "@/providers/LanguageProvider";

export function UpcomingEvents({ events }: { events: any[] }) {
  const { t, language } = useTranslation();

  return (
    <section className="bg-navy py-32 text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 lotus-pattern pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            {t("home.events.title")} <span className="text-gold">{t("home.events.titleGold")}</span>
          </h2>
          <div className="h-1.5 w-24 gradient-gold mx-auto mb-6" />
          <p className="font-myanmar text-gold-light text-xl">
            {t("home.events.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events?.map((event: any, i: number) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={event.id}
              className="bg-white/5 border border-white/10 p-2 flex flex-col md:flex-row group hover:bg-white/10 hover:border-gold/30 transition-all rounded-[2rem] overflow-hidden"
            >
              <div className="relative w-full md:w-2/5 aspect-4/3 md:aspect-auto">
                <Image
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070"
                  }
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 bg-maroon text-white font-black px-4 py-2 rounded-xl text-center shadow-lg border border-gold/30">
                  <span className="block text-2xl leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="block text-[10px] uppercase">
                    {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'th' ? 'th-TH' : 'en-US', {
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center">
                <Badge className="w-fit bg-gold/20 text-gold hover:bg-gold/30 mb-4 tracking-widest uppercase text-[10px] py-1 px-3">
                  {event.location}
                </Badge>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-base font-myanmar text-cream/70 mb-6">
                  {event.titleMm}
                </p>
                <Link href={`/events/${event.id}`}>
                  <Button
                    variant="outline"
                    className="w-fit border-white/20 hover:border-gold text-white hover:bg-gold hover:text-navy rounded-full transition-all"
                  >
                    {t("events.details")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

