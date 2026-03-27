"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/providers/LanguageProvider";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-cream/10 pt-20 pb-32">
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[400px] bg-maroon/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-maroon/10 text-maroon mb-6 px-6 py-1.5 rounded-full border border-maroon/10 uppercase text-xs font-bold tracking-widest">
              {t("contact.badge")}
            </Badge>
            <h1 className="text-6xl font-black text-maroon mb-6">
              {t("contact.title")} <span className="text-gradient-gold">{t("contact.titleGold")}</span>
            </h1>
            <p className="text-xl text-navy/70 font-myanmar max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-10">
              <div className="p-10 rounded-[3rem] bg-white border border-gold/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                
                <h3 className="text-2xl font-black text-maroon mb-10">Office Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="size-12 rounded-2xl bg-maroon/5 flex items-center justify-center shrink-0">
                      <MapPin className="size-6 text-maroon" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gold uppercase tracking-widest mb-1">{t("contact.info.address")}</p>
                      <p className="text-navy/70 font-bold">123 Pagoda Road, Yangon, Myanmar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="size-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                      <Phone className="size-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-maroon uppercase tracking-widest mb-1">{t("contact.info.phone")}</p>
                      <p className="text-navy/70 font-bold">+95 9 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="size-12 rounded-2xl bg-maroon/5 flex items-center justify-center shrink-0">
                      <Mail className="size-6 text-maroon" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gold uppercase tracking-widest mb-1">{t("contact.info.email")}</p>
                      <p className="text-navy/70 font-bold">info@dhammaschool.org</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-10 md:p-14 rounded-[3.5rem] bg-white border-2 border-gold/10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-maroon uppercase tracking-widest ml-1">{t("contact.form.name")}</label>
                      <Input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="U Ba"
                        className="h-14 rounded-2xl border-gold/20 focus:border-maroon focus:ring-maroon/5 bg-cream/5"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-maroon uppercase tracking-widest ml-1">{t("contact.form.email")}</label>
                      <Input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="uba@example.com"
                        className="h-14 rounded-2xl border-gold/20 focus:border-maroon focus:ring-maroon/5 bg-cream/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-maroon uppercase tracking-widest ml-1">{t("contact.form.subject")}</label>
                    <Input 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Question about Dhamma Teachings"
                      className="h-14 rounded-2xl border-gold/20 focus:border-maroon focus:ring-maroon/5 bg-cream/5"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-maroon uppercase tracking-widest ml-1">{t("contact.form.message")}</label>
                    <Textarea 
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="rounded-[2rem] border-gold/20 focus:border-maroon focus:ring-maroon/5 bg-cream/5 p-6"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-16 rounded-3xl bg-maroon hover:bg-gold text-white font-black text-lg transition-all shadow-xl shadow-maroon/20 flex items-center justify-center gap-3"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="animate-spin size-6" />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="size-6" />
                        {t("contact.form.send")}
                      </>
                    )}
                  </Button>

                  {status === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 text-emerald-700"
                    >
                      <CheckCircle2 className="size-6" />
                      <p className="font-bold">{t("contact.form.success")}</p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-4 text-rose-700"
                    >
                      <AlertCircle className="size-6" />
                      <p className="font-bold">{t("contact.form.error")}</p>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
