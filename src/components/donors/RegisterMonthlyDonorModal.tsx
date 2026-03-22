"use client";

import { useState } from "react";
import { useTranslation } from "@/providers/LanguageProvider";
import api from "@/lib/api";
import { Loader2, Plus, X } from "lucide-react";

export function RegisterMonthlyDonorModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
    currency: "MMK",
    category: "general",
    startDate: new Date().toISOString().slice(0, 10),
    remarks: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/donations/monthly-donor-subscriptions", {
        name: formData.name,
        phone: formData.phone,
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        startDate: new Date(formData.startDate).toISOString(),
        remarks: formData.remarks,
      });
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setFormData({
          name: "",
          phone: "",
          amount: "",
          currency: "MMK",
          category: "general",
          startDate: new Date().toISOString().slice(0, 10),
          remarks: "",
        });
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-maroon font-black px-6 py-3 rounded-full transition-all shadow-lg shadow-gold/20"
      >
        <Plus className="size-5" />
        {t("donors.monthly.register")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-navy border border-gold/20 rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              <X className="size-6" />
            </button>

            <h2 className="text-2xl font-black text-white mb-2">
              {t("donors.monthly.registerTitle")}
            </h2>
            <p className="text-cream/50 mb-8 text-sm">
              {t("donors.monthly.registerSubtitle")}
            </p>

            {success ? (
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-2xl p-6 text-center">
                <p className="font-bold text-lg mb-2">Registration Successful!</p>
                <p className="text-sm opacity-80">Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 text-red-100 border border-red-500/30 p-4 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                    Name *
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                      {t("donors.monthly.startMonth")} *
                    </label>
                    <input
                      required
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                      Monthly Amount *
                    </label>
                    <input
                      required
                      type="number"
                      min="1000"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="e.g. 10000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full bg-navy border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 transition-all font-medium"
                    >
                      <option className="bg-navy text-white text-base py-2" value="MMK">MMK</option>
                      <option className="bg-navy text-white text-base py-2" value="USD">USD</option>
                      <option className="bg-navy text-white text-base py-2" value="THB">THB</option>
                      <option className="bg-navy text-white text-base py-2" value="SGD">SGD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                    {t("donors.monthly.categories.label")} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-navy border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 transition-all font-medium"
                  >
                    <option className="bg-navy text-white text-base py-2" value="robes">{t("donors.monthly.categories.robes")}</option>
                    <option className="bg-navy text-white text-base py-2" value="alms">{t("donors.monthly.categories.alms")}</option>
                    <option className="bg-navy text-white text-base py-2" value="monastery">{t("donors.monthly.categories.monastery")}</option>
                    <option className="bg-navy text-white text-base py-2" value="medicine">{t("donors.monthly.categories.medicine")}</option>
                    <option className="bg-navy text-white text-base py-2" value="education">{t("donors.monthly.categories.education")}</option>
                    <option className="bg-navy text-white text-base py-2" value="general">{t("donors.monthly.categories.general")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cream/70 uppercase tracking-widest mb-1.5 ml-1">
                    Message / Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium resize-none"
                    placeholder="Optional message"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-maroon font-black py-4 rounded-2xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                    Submit Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
