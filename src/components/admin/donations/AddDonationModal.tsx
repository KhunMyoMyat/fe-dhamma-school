"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/LanguageProvider";

interface AddDonationModalProps {
  onSuccess: () => void;
  initialData?: {
    donorName: string;
    amount: string;
    currency: string;
    category?: string;
  };
  triggerButton?: React.ReactNode;
}

export function AddDonationModal({ onSuccess, initialData, triggerButton }: AddDonationModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donorName: initialData?.donorName || "",
    amount: initialData?.amount || "",
    currency: initialData?.currency || "MMK",
    category: initialData?.category || "general",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post("/donations", {
        donorName: formData.donorName,
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        message: formData.message,
      });

      setIsOpen(false);
      setFormData({
        donorName: initialData?.donorName || "",
        amount: initialData?.amount || "",
        currency: initialData?.currency || "MMK",
        category: initialData?.category || "general",
        message: "",
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to add donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setIsOpen(true)} className="inline-block">
          {triggerButton}
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 bg-navy hover:bg-navy/90 text-white rounded-2xl px-6 font-black text-sm md:text-base shadow-lg"
        >
          <Plus className="mr-2 size-5" /> Add Donation
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="absolute top-6 right-6 text-navy/40 hover:text-navy transition-colors"
            >
              <X className="size-6" />
            </button>

            <h2 className="text-2xl font-black text-navy mb-2">Record Donation</h2>
            <p className="text-navy/50 mb-8 text-sm font-medium">
              Manually add an actual donation received from a donor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1">
                  Donor Name *
                </label>
                <input
                  required
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all text-left"
                  placeholder="e.g. U Khin Maung"
                />
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-4">
                <div>
                  <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                    Amount *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all text-left"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all cursor-pointer text-left"
                  >
                    <option value="MMK">MMK</option>
                    <option value="USD">USD</option>
                    <option value="THB">THB</option>
                    <option value="SGD">SGD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                  {t("donors.monthly.categories.label")} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all cursor-pointer text-left"
                >
                  <option value="robes">{t("donors.monthly.categories.robes")}</option>
                  <option value="alms">{t("donors.monthly.categories.alms")}</option>
                  <option value="monastery">{t("donors.monthly.categories.monastery")}</option>
                  <option value="medicine">{t("donors.monthly.categories.medicine")}</option>
                  <option value="education">{t("donors.monthly.categories.education")}</option>
                  <option value="general">{t("donors.monthly.categories.general")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                  Message / Remarks
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-medium outline-none focus:ring-2 focus:ring-maroon/20 transition-all resize-none text-left"
                  placeholder="Optional details about this donation"
                />
              </div>

              <div className="pt-4 text-left">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-maroon hover:bg-gold text-white hover:text-navy font-black rounded-xl text-lg transition-colors border-none"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    "Save Record"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
