"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  Save, 
  Upload, 
  Info,
  Calendar,
  Languages,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string().min(3, "English Title must be at least 3 characters"),
  titleMm: z.string().min(1, "Myanmar Title is required"),
  description: z.string().optional().or(z.literal("")),
  descriptionMm: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "Start Date & Time is required"),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  mainSponsor: z.string().optional().or(z.literal("")),
  mainSponsorMm: z.string().optional().or(z.literal("")),
  coSponsors: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    nameMm: z.string().optional().or(z.literal("")),
  })).optional(),
  isActive: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function EventForm({ initialData, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...initialData,
      date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
      isActive: initialData?.isActive ?? true,
      coSponsors: initialData?.coSponsors || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coSponsors",
  });

  const onSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = {
        ...values,
        date: new Date(values.date).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        description: values.description || undefined,
        descriptionMm: values.descriptionMm || undefined,
        location: values.location || undefined,
        image: values.image || undefined,
        mainSponsor: values.mainSponsor || undefined,
        mainSponsorMm: values.mainSponsorMm || undefined,
        coSponsors: values.coSponsors?.length ? values.coSponsors : undefined,
      };

      if (isEditing) {
        await api.put(`/events/${initialData.id}`, data);
      } else {
        await api.post("/events", data);
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      console.error("❌ Event Submit Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl text-navy">
      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-myanmar flex items-center gap-3 shadow-sm">
          <Info className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-navy">
        {/* Left Side: English Info */}
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="size-10 rounded-xl bg-maroon/5 flex items-center justify-center">
              <Sparkles className="size-5 text-maroon" />
            </div>
            <h3 className="font-black text-maroon uppercase tracking-tight text-xl">English Information</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Event Title</label>
              <input 
                {...register("title")}
                className="w-full h-16 bg-cream/30 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
                placeholder="Ex: Vesak Day Celebration"
              />
              {errors.title && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Description</label>
              <textarea 
                {...register("description")}
                rows={4}
                className="w-full bg-cream/30 border-2 border-gold/10 rounded-2xl p-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy resize-none"
                placeholder="Details about the event..."
              />
            </div>
          </div>
        </div>

        {/* Right Side: Myanmar Info */}
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="size-10 rounded-xl bg-gold/5 flex items-center justify-center">
              <Languages className="size-5 text-gold" />
            </div>
            <h3 className="font-black text-maroon uppercase tracking-tight text-xl font-myanmar">မြန်မာဘာသာ အချက်အလက်</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">ပွဲအမည်</label>
              <input 
                {...register("titleMm")}
                className="w-full h-16 bg-cream/30 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy font-myanmar"
                placeholder="ဥပမာ- ကဆုန်လပြည့် ဗုဒ္ဓနေ့ အခမ်းအနား"
              />
              {errors.titleMm && <p className="text-[10px] text-red-500 font-bold ml-4 font-myanmar">{errors.titleMm.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">ပွဲအကြောင်းအရာ</label>
              <textarea 
                {...register("descriptionMm")}
                rows={4}
                className="w-full bg-cream/30 border-2 border-gold/10 rounded-2xl p-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy resize-none font-myanmar"
                placeholder="ဤပွဲအကြောင်းကို ရှင်းပြပေးပါ..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Location */}
      <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-xl shadow-maroon/5 space-y-10">
        <h3 className="text-2xl font-black text-maroon uppercase tracking-tight flex items-center gap-4">
          <Calendar className="size-8 text-gold" /> 
          Schedule & Venue
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Start Date & Time</label>
            <div className="relative">
              <input 
                {...register("date")}
                type="datetime-local"
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy appearance-none"
              />
              <Clock className="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-navy/20 pointer-events-none" />
            </div>
            {errors.date && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.date.message}</p>}
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">End Date & Time (Optional)</label>
            <div className="relative">
              <input 
                {...register("endDate")}
                type="datetime-local"
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy appearance-none"
              />
              <Clock className="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-navy/20 pointer-events-none" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Location / Venue</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-maroon transition-colors">
                <MapPin className="size-5" />
              </div>
              <input 
                {...register("location")}
                placeholder="Ex: Main Hall, Dhamma School Temple"
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-16 pr-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Event Image URL</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-maroon transition-colors">
              <Upload className="size-5" />
            </div>
            <input 
              {...register("image")}
              placeholder="Paste image URL here..."
              className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-16 pr-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-cream/20 rounded-2xl border border-gold/5">
          <input 
            type="checkbox" 
            {...register("isActive")}
            id="isActive"
            className="size-6 accent-maroon border-gold/30 rounded"
          />
          <label htmlFor="isActive" className="font-bold text-maroon cursor-pointer">
            Visible on Website (Active)
          </label>
        </div>
      </div>

      {/* Sponsorship Grid */}
      <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-xl shadow-maroon/5 space-y-10">
        <h3 className="text-2xl font-black text-maroon uppercase tracking-tight flex items-center gap-4">
          <Sparkles className="size-8 text-gold" /> 
          Sponsorship (Optional)
        </h3>

        {/* Main Sponsor Section */}
        <div className="bg-cream/20 p-8 rounded-[2rem] border border-gold/10 space-y-6">
          <Badge className="bg-maroon text-gold">Main Sponsor</Badge>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Name (English)</label>
              <input 
                {...register("mainSponsor")}
                className="w-full h-16 bg-white border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon outline-none transition-all font-bold text-navy"
                placeholder="Ex: U Ba & Family"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4 font-myanmar">အမည် (မြန်မာ)</label>
              <input 
                {...register("mainSponsorMm")}
                className="w-full h-16 bg-white border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon outline-none transition-all font-bold text-navy font-myanmar"
                placeholder="ဥပမာ- ဦးဘနှင့် မိသားစု"
              />
            </div>
          </div>
        </div>

        {/* Co-Sponsors Repeater */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <Badge variant="outline" className="border-gold/30 text-gold">Co-Sponsors List</Badge>
             <Button 
                type="button" 
                onClick={() => append({ name: "", nameMm: "" })}
                variant="outline"
                className="border-maroon/20 text-maroon hover:bg-maroon hover:text-white rounded-xl font-bold"
             >
                <Plus className="size-4 mr-2" /> Add Co-Sponsor
             </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="group relative bg-white p-6 rounded-2xl border border-gold/10 hover:border-gold/30 transition-all flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-black text-navy/20 uppercase tracking-widest ml-2">Co-Sponsor Name (EN)</label>
                   <input 
                      {...register(`coSponsors.${index}.name` as const)}
                      className="w-full h-12 bg-cream/10 border border-gold/10 rounded-xl px-4 focus:border-maroon outline-none font-bold text-sm"
                      placeholder="English Name"
                   />
                </div>
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-black text-navy/20 uppercase tracking-widest ml-2 font-myanmar">အမည် (မြန်မာ)</label>
                   <input 
                      {...register(`coSponsors.${index}.nameMm` as const)}
                      className="w-full h-12 bg-cream/10 border border-gold/10 rounded-xl px-4 focus:border-maroon outline-none font-bold text-sm font-myanmar"
                      placeholder="မြန်မာအမည်"
                   />
                </div>
                <Button 
                  type="button" 
                  onClick={() => remove(index)}
                  variant="ghost" 
                  className="size-12 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl p-0"
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gold/10 rounded-[2rem] text-navy/20 font-bold italic text-sm">
                No co-sponsors added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-64 h-16 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-xl shadow-lg shadow-maroon/20 transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" /> {isEditing ? "Update" : "Create"} Event</>}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/events")}
          variant="ghost"
          className="h-16 text-navy/40 hover:text-maroon font-bold text-lg px-8 rounded-2xl"
        >
          Cancel & Exit
        </Button>
      </div>
    </form>
  );
}
