"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Save,
  Upload,
  FileText,
  Languages,
  User,
  Link as LinkIcon,
  Music2,
  Video,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { resolveFileUrl } from "@/lib/fileUrl";
import toast from "react-hot-toast";

const teachingSchema = z.object({
  translations: z
    .array(
      z.object({
        locale: z.enum(["mm", "en", "th"]),
        title: z.string().min(2, "Title is required"),
        content: z.string().optional().or(z.literal("")),
      })
    )
    .min(1, "Add at least one translation"),
  category: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  audioUrl: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  documentUrl: z.string().optional().or(z.literal("")),
  documentName: z.string().optional().or(z.literal("")),
  documentType: z.string().optional().or(z.literal("")),
  documentSize: z.number().optional().or(z.literal(0)),
  teacherId: z.string().optional().or(z.literal("")),
  isPublished: z.boolean(),
}).superRefine((val, ctx) => {
  if (val.category === "dhamma_book") {
    if (!val.documentUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Document is required for Dhamma Book", path: ["documentUrl"] });
    }
    if (!val.coverImageUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cover image is required for Dhamma Book", path: ["coverImageUrl"] });
    }
  }
});

type TeachingFormValues = z.infer<typeof teachingSchema>;

interface TeachingFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const CATEGORY_OPTIONS = [
  "dhamma",
  "dhamma_book",
  "sutra",
  "vinaya",
  "abhidhamma",
  "meditation",
  "chanting",
  "other",
];

const LOCALE_OPTIONS = [
  { value: "mm", label: "Myanmar (MM)" },
  { value: "en", label: "English (EN)" },
  { value: "th", label: "Thai (TH)" },
];

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function TeachingForm({ initialData, isEditing = false }: TeachingFormProps) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TeachingFormValues>({
    resolver: zodResolver(teachingSchema),
    defaultValues: {
      ...initialData,
      translations:
        initialData?.translations?.length > 0
          ? initialData.translations.map((t: any) => ({
              locale: t.locale,
              title: t.title || "",
              content: t.content || "",
            }))
          : [{ locale: "mm", title: "", content: "" }],
      category: initialData?.category || "dhamma",
      coverImageUrl: initialData?.coverImageUrl || "",
      isPublished: initialData?.isPublished ?? true,
      documentSize: initialData?.documentSize || 0,
      documentType: initialData?.documentType || "",
      documentName: initialData?.documentName || "",
      documentUrl: initialData?.documentUrl || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "translations",
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers");
        setTeachers(response.data.data || response.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleDocumentUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      setValue("documentUrl", data.url);
      setValue("documentName", data.originalName || data.filename);
      setValue("documentType", data.mimeType || "application/pdf");
      setValue("documentSize", data.size || 0);
      toast.success("Document uploaded successfully!");
    } catch (err: any) {
      console.error("Document upload failed:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      setValue("coverImageUrl", data.url);
      toast.success("Cover uploaded successfully!");
    } catch (err: any) {
      console.error("Cover upload failed:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Cover upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: TeachingFormValues) => {
    setIsLoading(true);
    try {
      const shouldClearDocument = isEditing && values.documentUrl === "";
      const translations = values.translations.map((t) => ({
        locale: t.locale,
        title: t.title.trim(),
        content: t.content ? t.content.trim() : undefined,
      }));
      const data = {
        ...values,
        translations,
        category: values.category || "dhamma",
        coverImageUrl: values.coverImageUrl || undefined,
        audioUrl: values.audioUrl || undefined,
        videoUrl: values.videoUrl || undefined,
        documentUrl: shouldClearDocument ? "" : values.documentUrl || undefined,
        documentName: shouldClearDocument ? "" : values.documentName || undefined,
        documentType: shouldClearDocument ? "" : values.documentType || undefined,
        documentSize: shouldClearDocument ? 0 : values.documentSize || undefined,
        teacherId: values.teacherId || undefined,
        isPublished: Boolean(values.isPublished),
      };

      if (isEditing) {
        await api.put(`/teachings/${initialData.id}`, data);
        toast.success("Teaching updated successfully!");
      } else {
        await api.post("/teachings", data);
        toast.success("New teaching created successfully!");
      }

      setTimeout(() => {
        router.push("/admin/teachings");
        router.refresh();
      }, 900);
    } catch (err: any) {
      console.error("Teaching Submit Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const documentUrl = watch("documentUrl");
  const documentName = watch("documentName");
  const documentSize = watch("documentSize");
  const documentType = watch("documentType");
  const category = watch("category");
  const coverImageUrl = watch("coverImageUrl");
  const resolvedDocumentUrl = resolveFileUrl(documentUrl);
  const resolvedCoverImageUrl = resolveFileUrl(coverImageUrl);
  const translationValues = watch("translations");
  const usedLocales = new Set((translationValues || []).map((t) => t?.locale));
  const nextLocale = LOCALE_OPTIONS.find((opt) => !usedLocales.has(opt.value))?.value;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl">
      <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-xl shadow-maroon/5 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-gold/5 flex items-center justify-center">
              <Languages className="size-5 text-gold" />
            </div>
            <h3 className="font-black text-maroon uppercase tracking-tight text-xl">Translations</h3>
          </div>
          <Button
            type="button"
            disabled={!nextLocale}
            onClick={() => nextLocale && append({ locale: nextLocale, title: "", content: "" })}
            className={cn(
              "h-11 px-5 rounded-xl font-bold text-sm",
              nextLocale
                ? "bg-maroon text-white hover:bg-gold hover:text-navy"
                : "bg-cream/40 text-navy/40 cursor-not-allowed"
            )}
          >
            Add Translation
          </Button>
        </div>

        {errors.translations?.message && (
          <p className="text-xs font-bold text-red-500">{errors.translations.message as string}</p>
        )}

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gold/10 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Locale</label>
                  <select
                    {...register(`translations.${index}.locale`)}
                    className="w-full h-12 bg-cream/30 border-2 border-gold/10 rounded-xl px-4 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
                  >
                    {LOCALE_OPTIONS.map((opt) => {
                      const isUsed = usedLocales.has(opt.value) && translationValues?.[index]?.locale !== opt.value;
                      return (
                        <option key={opt.value} value={opt.value} disabled={isUsed}>
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="h-11 px-4 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50"
                  >
                    <X className="size-4 mr-1" /> Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Title</label>
                  <input
                    {...register(`translations.${index}.title`)}
                    className="w-full h-14 bg-cream/30 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy"
                    placeholder="Teaching title"
                  />
                  {errors.translations?.[index]?.title && (
                    <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">
                      {errors.translations[index]?.title?.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Content</label>
                  <textarea
                    {...register(`translations.${index}.content`)}
                    rows={4}
                    className="w-full bg-cream/30 border-2 border-gold/10 rounded-2xl p-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy resize-none"
                    placeholder="Write the teaching or summary..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-xl shadow-maroon/5 space-y-10">
        <h3 className="text-2xl font-black text-maroon uppercase tracking-tight flex items-center gap-4">
          <SettingsIcon className="size-8 text-gold" />
          Teaching Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Category</label>
            <select
              {...register("category")}
              className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl px-6 focus:border-maroon focus:bg-white outline-none transition-all font-bold text-navy appearance-none"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "dhamma_book" ? "Dhamma Book" : cat}
                </option>
              ))}
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

          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Publish Status</label>
            <div className="flex items-center gap-4 p-4 bg-cream/30 border border-gold/10 rounded-2xl">
              <input
                type="checkbox"
                {...register("isPublished")}
                id="isPublished"
                className="size-5 accent-maroon border-gold/30 rounded"
              />
              <label htmlFor="isPublished" className="font-bold text-maroon cursor-pointer">
                Publish immediately
              </label>
            </div>
          </div>
        </div>

        {category === "dhamma_book" && (
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-maroon/5 flex items-center justify-center">
                <ImageIcon className="size-5 text-maroon" />
              </div>
              <div>
                <p className="font-black text-maroon uppercase tracking-tight text-lg">Book Cover</p>
                <p className="text-xs text-navy/40 font-bold">Upload a cover image (recommended)</p>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-2xl p-6 bg-cream/30 flex flex-col md:flex-row md:items-center gap-4 border-gold/10">
              <div className="flex-1">
                {coverImageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl overflow-hidden border border-gold/10 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolvedCoverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-bold text-navy/60 break-words">{coverImageUrl}</div>
                  </div>
                ) : (
                  <p className="text-sm text-navy/40 font-bold">Upload a cover so the book card shows an image.</p>
                )}
                {errors.coverImageUrl && (
                  <p className="text-xs font-bold text-red-500 mt-2">{errors.coverImageUrl.message as string}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {coverImageUrl && (
                  <button
                    type="button"
                    onClick={() => setValue("coverImageUrl", "")}
                    className="h-11 px-4 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                  >
                    <X className="size-4 mr-1" /> Remove
                  </button>
                )}
                <label className={cn(
                  "inline-flex items-center gap-2 h-11 px-5 rounded-xl font-bold cursor-pointer transition-colors",
                  isUploading ? "bg-gold/20 text-gold" : "bg-maroon text-white hover:bg-gold hover:text-navy"
                )}>
                  {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  {isUploading ? "Uploading..." : coverImageUrl ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Audio URL</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-maroon transition-colors">
                <Music2 className="size-5" />
              </div>
              <input
                {...register("audioUrl")}
                placeholder="Paste audio link"
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-16 pr-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">Video URL</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-maroon transition-colors">
                <Video className="size-5" />
              </div>
              <input
                {...register("videoUrl")}
                placeholder="Paste video link"
                className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-16 pr-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-maroon/5 flex items-center justify-center">
              <FileText className="size-5 text-maroon" />
            </div>
            <div>
              <p className="font-black text-maroon uppercase tracking-tight text-lg">PDF / eBook Upload</p>
              <p className="text-xs text-navy/40 font-bold">Accepted: PDF, EPUB (max 25MB)</p>
            </div>
          </div>

          <div className={cn(
            "border-2 border-dashed rounded-2xl p-6 bg-cream/30 flex flex-col md:flex-row md:items-center gap-4",
            isUploading ? "border-gold/40" : "border-gold/10"
          )}>
            <div className="flex-1">
              {documentUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-maroon font-bold">
                    <FileText className="size-5" />
                    <span className="truncate">{documentName || "Document"}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-navy/50">
                    {documentType && <span className="uppercase">{documentType.split("/").pop()}</span>}
                    {documentSize ? <span>{formatBytes(documentSize)}</span> : null}
                    {resolvedDocumentUrl && (
                      <a href={resolvedDocumentUrl} target="_blank" className="inline-flex items-center gap-1 text-maroon hover:text-gold transition-colors">
                        <LinkIcon className="size-3" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-navy/40 font-bold">Upload a PDF or EPUB so users can read and download.</p>
              )}
              {errors.documentUrl && (
                <p className="text-xs font-bold text-red-500 mt-2">{errors.documentUrl.message as string}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {documentUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("documentUrl", "");
                    setValue("documentName", "");
                    setValue("documentType", "");
                    setValue("documentSize", 0);
                  }}
                  className="h-11 px-4 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                >
                  <X className="size-4 mr-1" /> Remove
                </button>
              )}
              <label className={cn(
                "inline-flex items-center gap-2 h-11 px-5 rounded-xl font-bold cursor-pointer transition-colors",
                isUploading ? "bg-gold/20 text-gold" : "bg-maroon text-white hover:bg-gold hover:text-navy"
              )}>
                {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {isUploading ? "Uploading..." : documentUrl ? "Replace" : "Upload"}
                <input
                  type="file"
                  accept=".pdf,.epub"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-64 h-16 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-xl shadow-lg shadow-maroon/20 transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" /> {isEditing ? "Update" : "Create"} Teaching</>}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/teachings")}
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
  );
}
