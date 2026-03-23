"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  Heart,
  Send,
  User,
  Phone,
  Mail,
  MessageSquare,
  Medal
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useTranslation } from "@/providers/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function EventSponsorshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    sponsorType: "co_sponsor"
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/contact", {
        name: formData.name,
        email: formData.email || undefined,
        subject: `Sponsorship Interest: ${event?.title || "Unknown Event"}`,
        message: `Phone: ${formData.phone}\n\nInquiry: ${formData.message}`,
        eventId: id,
        sponsorType: formData.sponsorType
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit sponsorship inquiry:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="size-12 text-gold animate-spin mb-4" />
        <p className="text-cream/40 font-bold uppercase tracking-widest text-xs">Preparing your merit...</p>
      </div>
    );
  }

  const isMyanmar = language === "mm";

  return (
    <div className="min-h-screen bg-navy pt-32 pb-20 text-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-maroon/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <Link href={`/events/${id}`} className="group inline-flex items-center gap-2 text-gold hover:text-white transition-all font-bold mb-12 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:border-gold/50">
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" /> {t("common.back")}
        </Link>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-[3.5rem] p-8 md:p-16 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex flex-col items-center text-center mb-12">
                  <div className="size-20 rounded-3xl bg-gold/20 flex items-center justify-center mb-6 shadow-xl shadow-gold/10">
                    <Sparkles className="size-10 text-gold" />
                  </div>
                  <Badge className="bg-gold/10 text-gold border-gold/30 mb-4 px-4 py-1.5 uppercase tracking-widest">
                    {t("events.sponsorship.title")}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                    Sponsor <span className="text-gold italic">"{isMyanmar ? event.titleMm : event.title}"</span>
                  </h1>
                  <p className="text-lg text-cream/50 max-w-xl mx-auto leading-relaxed">
                    {t("events.sponsorship.offer")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-bold text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-4">Sponsorship Level</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sponsorType: "main" })}
                          className={`h-20 rounded-3xl border-2 flex items-center justify-center gap-4 font-black transition-all ${
                            formData.sponsorType === "main" 
                            ? "bg-gold text-navy border-gold shadow-lg shadow-gold/20" 
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className={`size-10 rounded-xl flex items-center justify-center ${formData.sponsorType === "main" ? "bg-navy/10 text-navy" : "bg-white/5 text-gold/40"}`}>
                            <Medal className="size-6" />
                          </div>
                          <span>Main Sponsor</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sponsorType: "co_sponsor" })}
                          className={`h-20 rounded-3xl border-2 flex items-center justify-center gap-4 font-black transition-all ${
                            formData.sponsorType === "co_sponsor" 
                            ? "bg-gold text-navy border-gold shadow-lg shadow-gold/20" 
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className={`size-10 rounded-xl flex items-center justify-center ${formData.sponsorType === "co_sponsor" ? "bg-navy/10 text-navy" : "bg-white/5 text-gold/40"}`}>
                            <Heart className="size-6" />
                          </div>
                          <span>Co-Sponsor</span>
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-4">Full Name / Organization</label>
                       <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-white/20 group-focus-within:text-gold transition-colors" />
                          <input 
                            required
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: U Ba & Family"
                            className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl pl-16 pr-6 focus:border-gold focus:bg-white/10 outline-none transition-all font-bold"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-4">Contact Number</label>
                       <div className="relative group">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-white/20 group-focus-within:text-gold transition-colors" />
                          <input 
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+95 9..."
                            className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl pl-16 pr-6 focus:border-gold focus:bg-white/10 outline-none transition-all font-bold"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-4">Email Address (Optional)</label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-white/20 group-focus-within:text-gold transition-colors" />
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="yourname@email.com"
                          className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl pl-16 pr-6 focus:border-gold focus:bg-white/10 outline-none transition-all font-bold"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-4">Inquiry Message</label>
                     <div className="relative group">
                        <MessageSquare className="absolute left-6 top-10 -translate-y-1/2 size-5 text-white/20 group-focus-within:text-gold transition-colors" />
                        <textarea 
                          rows={4}
                          name="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about how you'd like to contribute..."
                          className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-16 pr-6 pt-6 focus:border-gold focus:bg-white/10 outline-none transition-all font-medium resize-none"
                        />
                     </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-10 rounded-2xl bg-gold text-navy font-black text-2xl hover:bg-white shadow-xl shadow-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin size-8" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Heart className="mr-3 size-6 fill-navy" /> Submit Sponsorship Interest
                      </>
                    )}
                  </Button>

                  <p className="text-center text-[10px] uppercase font-black tracking-widest text-cream/20">
                    Your details are kept sacred and private
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-[3.5rem] p-16 md:p-24 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center"
              >
                <div className="size-32 bg-gold text-navy rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-gold/40">
                  <CheckCircle2 className="size-20" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Sādhu! Sādhu! Sādhu!</h2>
                <p className="text-xl text-gold mb-10 font-bold uppercase tracking-widest">Inquiry Received</p>
                <p className="text-xl text-cream/50 max-w-md mx-auto leading-relaxed mb-12">
                  Thank you for your generous interest in sponsoring this event. Our administrative team will contact you shortly to discuss the merits and arrangements.
                </p>
                <Link href={`/events/${id}`}>
                  <Button className="h-16 px-12 rounded-2xl bg-white text-navy font-black text-xl hover:bg-gold transition-all">
                    Return to Event
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
