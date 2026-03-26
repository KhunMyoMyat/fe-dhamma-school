"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  Save, 
  X, 
  Upload, 
  Info,
  BookOpen,
  Languages,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const courseSchema = z.object({
  title: z.string().min(3, "English Title must be at least 3 characters"),
  titleMm: z.string().min(1, "Myanmar Title is required"),
  description: z.string().min(10, "English Description is required"),
  descriptionMm: z.string().min(1, "Myanmar Description is required"),
  level: z.string(),
  duration: z.string().optional().or(z.literal("")),
  schedule: z.string().optional().or(z.literal("")),
  teacherId: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  daysOfWeek: z.array(z.string()),
  classTime: z.string().optional().or(z.literal("")),
  daysPerWeek: z.number().optional().or(z.literal(0)),
  type: z.literal("VIDEO"),
  videoUrl: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});


type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function CourseForm({ initialData, isEditing = false }: CourseFormProps) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      ...initialData,
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
      daysOfWeek: initialData?.daysOfWeek || [],
      classTime: initialData?.classTime || "",
      daysPerWeek: initialData?.daysPerWeek || 0,
      level: initialData?.level || "beginner",
      type: "VIDEO",
      videoUrl: initialData?.videoUrl || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers");
        // Depending on API response structure. Based on createPaginatedResponse:
        setTeachers(response.data.data || response.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const onSubmit = async (values: CourseFormValues) => {
    setIsLoading(true);
    try {
      // Clean up empty strings for optional fields
      const data = {
        ...values,
        teacherId: values.teacherId || undefined,
        image: values.image || undefined,
        duration: values.duration || undefined,
        schedule: values.schedule || undefined,
        daysOfWeek: values.daysOfWeek,
        classTime: values.classTime || undefined,
        daysPerWeek: values.daysPerWeek ? Number(values.daysPerWeek) : undefined,
        startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
        type: "VIDEO",
        videoUrl: values.videoUrl || undefined,
        isActive: Boolean(values.isActive),
      };

      if (isEditing) {
        await api.put(`/courses/${initialData.id}`, data);
        toast.success("Course updated successfully! \nသင်တန်းအချက်အလက် ပြင်ဆင်မှု အောင်မြင်ပါသည်။");
      } else {
        await api.post("/courses", data);
        toast.success("New course created successfully! \nသင်တန်းအသစ် ဖန်တီးမှု အောင်မြင်ပါသည်။");
      }
      setTimeout(() => {
        router.push("/admin/courses");
        router.refresh();
      }, 1000); // Give toast time to show before navigation
    } catch (err: any) {
      console.error("❌ Course Submit Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again. \nအမှားအယွင်းဖြစ်ပွားနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl">

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: English Info */}
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="size-10 rounded-xl bg-maroon/5 flex items-center justify-center">
              <BookOpen className="size-5 text-maroon" />
            </div>
            <h3 className="font-black text-maroon uppercase tracking-tight text-xl">English Information</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Course Title</label>
              <input 
                {...register("title")}
                className="w-full h-16 bg-cream/30 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
                placeholder="Ex: Introduction to Buddhism"
              />
              {errors.title && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Description</label>
              <textarea 
                {...register("description")}
                rows={5}
                className="w-full bg-cream/30 border-2 border-gold/10 rounded-2xl p-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy resize-none"
                placeholder="Tell something about this course..."
              />
              {errors.description && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.description.message}</p>}
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
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">သင်တန်းအမည်</label>
              <input 
                {...register("titleMm")}
                className="w-full h-16 bg-cream/30 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy font-myanmar"
                placeholder="ဥပမာ- ဗုဒ္ဓဘာသာ မိတ်ဆက်"
              />
              {errors.titleMm && <p className="text-[10px] text-red-500 font-bold ml-4 font-myanmar">{errors.titleMm.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">သင်တန်းအကြောင်းအရာ</label>
              <textarea 
                {...register("descriptionMm")}
                rows={5}
                className="w-full bg-cream/30 border-2 border-gold/10 rounded-2xl p-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy resize-none font-myanmar"
                placeholder="ဤသင်တန်းအကြောင်းကို ရှင်းပြပေးပါ..."
              />
              {errors.descriptionMm && <p className="text-[10px] text-red-500 font-bold ml-4 font-myanmar">{errors.descriptionMm.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-xl shadow-maroon/5 space-y-10">
        <h3 className="text-2xl font-black text-maroon uppercase tracking-tight flex items-center gap-4">
          <SettingsIcon className="size-8 text-gold" /> 
          Additional Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 col-span-full">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">YouTube Video Link</label>
            <input 
              {...register("videoUrl")}
              placeholder="Ex: https://www.youtube.com/watch?v=..."
              className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Course Level</label>
            <select 
              {...register("level")}
              className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy appearance-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Assigned Teacher</label>
            <div className="relative">
              <select 
                {...register("teacherId")}
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy appearance-none"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.nameMm})</option>
                ))}
              </select>
              <User className="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-navy/20 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Course Image URL</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-maroon transition-colors">
              <Upload className="size-5" />
            </div>
            <input 
              {...register("image")}
              placeholder="Paste unsplash or image URL here..."
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
            Publish this course immediately (Active)
          </label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-64 h-16 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-xl shadow-lg shadow-maroon/20 transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" /> {isEditing ? "Update" : "Create"} Course</>}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/courses")}
          variant="ghost"
          className="h-16 text-navy/40 hover:text-maroon font-bold text-lg px-8 rounded-2xl"
        >
          Cancel & Exit
        </Button>
      </div>
    </form>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-full">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  )
}
