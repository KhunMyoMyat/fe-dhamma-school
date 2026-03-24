"use client";

import { useState } from "react";
import { useTranslation } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, CheckCircle2, Loader2, Send } from "lucide-react";
import api from "@/lib/api";

export default function SubmitDonationForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    donorName: "",
    amount: "",
    currency: "MMK",
    category: "general",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount || !file) {
      setError(
        "Please fill all required fields and upload the bank slip screenshot.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload the image
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const uploadRes = await api.post("/upload/public-image", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const slipUrl = uploadRes.data.url;

      // 2. Submit the donation with status: 'pending'
      await api.post("/donations", {
        donorName: formData.donorName,
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        message: formData.message,
        slipUrl,
        status: "pending",
      });

      setIsSuccess(true);
      setFormData({
        donorName: "",
        amount: "",
        currency: "MMK",
        category: "general",
        message: "",
      });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-20 bg-white/60 backdrop-blur-xl border border-gold/20 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-navy/5">
      <div className="text-center mb-8">
        <Badge className="bg-navy/5 text-navy border-navy/10 px-4 py-1.5 mb-4 font-bold uppercase tracking-widest text-xs">
          Submit Slip
        </Badge>
        <h3 className="text-3xl lg:text-4xl font-black text-maroon tracking-tight">
          Submit Transfer Details
        </h3>
        <p className="mt-3 text-[15px] text-navy/60 leading-relaxed max-w-88 mx-auto font-medium">
          Please upload a screenshot of your successful bank transfer to notify
          our admins.
        </p>
      </div>

      {isSuccess ? (
        <div className="text-center py-10">
          <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h4 className="text-3xl font-black text-navy mb-3">Thank you!</h4>
          <p className="text-navy/60 mb-10 max-w-xs mx-auto text-[15px] font-medium leading-relaxed">
            Your transfer details have been submitted to our admins for
            verification. Sadhu!
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="rounded-2xl h-14 px-8 border-navy/20 font-bold hover:bg-navy/5 transition-colors"
          >
            Submit Another Reference
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                {t("contact.form.name")} *
              </label>
              <Input
                value={formData.donorName}
                onChange={(e) =>
                  setFormData({ ...formData, donorName: e.target.value })
                }
                className="h-14 rounded-2xl bg-white/50 border-navy/10 focus:border-gold/50 font-bold text-navy"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                  Amount *
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="h-14 rounded-2xl bg-white/50 border-navy/10 focus:border-gold/50 font-bold text-navy"
                  placeholder="e.g. 50000"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl bg-white/50 border border-navy/10 px-4 focus:outline-none focus:border-gold/50 font-bold text-navy"
                >
                  <option value="MMK">MMK (Kyats)</option>
                  <option value="USD">USD ($)</option>
                  <option value="THB">THB (Baht)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full h-14 rounded-2xl bg-white/50 border border-navy/10 px-4 focus:outline-none focus:border-gold/50 font-bold text-navy capitalize"
              >
                {[
                  "general",
                  "robes",
                  "alms",
                  "monastery",
                  "medicine",
                  "education",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                Transfer Screenshot (Slip) *
              </label>
              <div
                className={`relative w-full h-40 rounded-2xl border-2 border-dashed ${file ? "border-maroon/40 bg-maroon/5" : "border-gold/40 bg-white/50"} flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden group`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-maroon mb-2" />
                    <p className="text-sm font-bold text-maroon max-w-[200px] truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-maroon/50 mt-1">
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-navy/40 group-hover:text-gold transition-colors">
                    <UploadCloud className="w-10 h-10 mb-3" />
                    <p className="text-[15px] font-bold">
                      Click to upload slip image
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-navy/60 uppercase tracking-widest ml-1 mb-2 block">
                Message (Optional)
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="min-h-[100px] rounded-2xl bg-white/50 border-navy/10 focus:border-gold/50 font-medium resize-none text-navy placeholder:text-navy/30 py-4"
                placeholder="Any message for your donation?"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 mt-4 rounded-2xl bg-maroon hover:bg-gold text-white font-black text-[17px] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-maroon/20 hover:shadow-gold/20 hover:-translate-y-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />{" "}
                Submit to Admin
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
