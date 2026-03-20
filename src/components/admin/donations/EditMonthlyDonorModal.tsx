"use client";

import { useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/LanguageProvider";

interface EditMonthlyDonorModalProps {
  donor: any;
  onSuccess: () => void;
}

export function EditMonthlyDonorModal({ donor, onSuccess }: EditMonthlyDonorModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: donor.name || "",
    phone: donor.phone || "",
    amount: donor.amount?.toString() || "",
    currency: donor.currency || "MMK",
    category: donor.category || "general",
    startDate: donor.startDate ? new Date(donor.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    remarks: donor.remarks || "",
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
      await api.put(`/donations/monthly-donor-subscriptions/${donor.id}`, {
        name: formData.name,
        phone: formData.phone,
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        startDate: new Date(formData.startDate).toISOString(),
        remarks: formData.remarks,
      });

      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Edit Subscription"
        className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-200"
      >
        <Pencil className="size-4" />
      </button>

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

            <h2 className="text-2xl font-black text-navy mb-2">Edit Subscription</h2>
            <p className="text-navy/50 mb-8 text-sm font-medium">
              Update details for this monthly donor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                  Name *
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-navy/60 uppercase tracking-widest mb-1.5 ml-1 text-left">
                    Start Month
                  </label>
                  <input
                    required
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20 transition-all text-left"
                  />
                </div>
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
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-cream/30 border border-navy/10 rounded-xl px-4 py-3 text-navy font-medium outline-none focus:ring-2 focus:ring-maroon/20 transition-all resize-none text-left"
                  placeholder="Optional details about this donor"
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
                    "Save Changes"
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
