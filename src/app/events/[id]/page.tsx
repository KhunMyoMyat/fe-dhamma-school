"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Share2, 
  Loader2, 
  Clock, 
  Sparkles,
  Users,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useTranslation } from "@/providers/LanguageProvider";
import Image from "next/image";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="size-12 text-gold animate-spin mb-4" />
        <p className="text-cream/40 font-bold uppercase tracking-widest text-xs">Loading Event Details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-white mb-6">Event Not Found</h1>
        <Link href="/events">
          <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-navy">
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isMyanmar = language === "mm";

  return (
    <div className="min-h-screen bg-navy pt-32 pb-20 text-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-maroon/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <Link href="/events" className="group inline-flex items-center gap-2 text-gold hover:text-white transition-all font-bold mb-12 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:border-gold/50">
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" /> {t("common.back")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video w-full rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl mb-12 group">
              <Image 
                src={event.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070"} 
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy via-transparent to-transparent opacity-60" />
            </div>

            <Badge className="bg-gold/20 text-gold mb-6 border-gold/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
              {t("home.events.title")}
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              {isMyanmar ? event.titleMm : event.title}
            </h1>

            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-black text-gold mb-6 flex items-center gap-3">
                <span className="h-8 w-1.5 bg-gold rounded-full" />
                {t("events.details")}
              </h2>
              <div className="text-xl text-cream/70 leading-relaxed font-myanmar space-y-6">
                {isMyanmar ? (
                   event.descriptionMm || "အသေးစိတ် အချက်အလက်များကို မကြာမီ ဖော်ပြပေးပါမည်။"
                ) : (
                   event.description || "Details for this event will be available soon."
                )}
              </div>
            </div>

            {/* Registration/Action Card */}
            <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-[3rem] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Interested in participating?</h3>
                <p className="text-cream/50">Register now to reserve your spot at this sacred gathering.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-gold text-navy font-black hover:bg-white hover:scale-105 transition-all shadow-xl shadow-gold/20">
                  Register Now
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-white/20 hover:border-gold hover:bg-white/5 transition-all">
                  Inquire
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Event Info Card */}
            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-md space-y-8">
               <div>
                  <div className="flex items-center gap-3 text-gold mb-3">
                    <Calendar className="size-6" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Date</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {new Date(event.date).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
               </div>

               <div>
                  <div className="flex items-center gap-3 text-gold mb-3">
                    <Clock className="size-6" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Time</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {new Date(event.date).toLocaleTimeString(language === 'mm' ? 'my-MM' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
               </div>

               <div>
                  <div className="flex items-center gap-3 text-gold mb-3">
                    <MapPin className="size-6" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Venue</span>
                  </div>
                  <p className="text-2xl font-bold font-myanmar">
                    {event.location || "TBA"}
                  </p>
               </div>
            </div>

            {/* Sponsorship Card */}
            {(event.mainSponsor || event.mainSponsorMm || (event.coSponsors && event.coSponsors.length > 0)) && (
              <div className="p-10 rounded-[3rem] bg-linear-to-br from-gold/20 to-gold/5 border border-gold/20 backdrop-blur-md space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="size-12 rounded-2xl bg-gold/20 flex items-center justify-center">
                    <Sparkles className="size-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-black text-gold uppercase tracking-tight">
                    {t("events.sponsorship.donorsTitle")}
                  </h3>
                </div>

                {/* Main Sponsor */}
                {(event.mainSponsor || event.mainSponsorMm) && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                       <Badge className="bg-maroon text-gold border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Main Sponsor</Badge>
                    </div>
                    <p className="text-2xl font-black text-white font-myanmar leading-tight">
                      {isMyanmar ? (event.mainSponsorMm || event.mainSponsor) : (event.mainSponsor || event.mainSponsorMm)}
                    </p>
                  </div>
                )}

                {/* Co-Sponsors List */}
                {event.coSponsors?.map((sponsor: any, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                       <Badge className="bg-gold/10 text-gold/80 border-gold/20 font-black text-[10px] uppercase tracking-widest px-3 py-1">Co-Sponsor</Badge>
                    </div>
                    <p className="text-xl font-bold text-cream/90 font-myanmar leading-tight">
                      {isMyanmar ? (sponsor.nameMm || sponsor.name) : (sponsor.name || sponsor.nameMm)}
                    </p>
                  </div>
                ))}
                
                <p className="text-[10px] text-gold/40 font-bold uppercase tracking-[0.2em] text-center italic mt-4">
                  "Sabbadānaṃ dhammadānaṃ jināti"
                </p>
              </div>
            )}

            {/* Become a Sponsor Offer Card (Always Visible) */}
            <div className="p-10 rounded-[3rem] bg-linear-to-br from-maroon/20 to-maroon/5 border border-maroon/20 backdrop-blur-md space-y-6">
              <div className="size-12 rounded-2xl bg-maroon/20 flex items-center justify-center">
                <Users className="size-6 text-maroon-light" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                {t("events.sponsorship.title")}
              </h3>
              <p className="text-cream/60 font-myanmar leading-relaxed">
                {t("events.sponsorship.offer")}
              </p>
              <Link href={`/events/${id}/sponsor`} className="block">
                <Button className="w-full h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl font-black transition-all">
                  {t("events.sponsorship.cta")}
                </Button>
              </Link>
            </div>

            {/* Share Section */}
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center gap-6">
               <p className="text-sm font-bold text-cream/40 uppercase tracking-widest">Help spread the word</p>
               <div className="flex gap-4">
                  {[1,2,3].map(i => (
                    <button key={i} className="size-12 rounded-xl bg-white/5 hover:bg-gold hover:text-navy transition-all flex items-center justify-center border border-white/5">
                      <Share2 className="size-5" />
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
