"use client";

import { useEffect, useState, use } from "react";
import { TeachingForm } from "@/components/admin/TeachingForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function EditTeachingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [teaching, setTeaching] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeaching = async () => {
      try {
        const response = await api.get(`/teachings/${id}`);
        setTeaching(response.data);
      } catch (error) {
        console.error("Error fetching teaching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeaching();
  }, [id]);

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div>
        <Link
          href="/admin/teachings"
          className="inline-flex items-center text-navy/40 hover:text-maroon font-bold text-sm mb-6 transition-colors group"
        >
          <ChevronLeft className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Teachings
        </Link>
        <h1 className="text-4xl font-black text-maroon tracking-tight uppercase">
          Edit <span className="text-gold">Teaching</span>
        </h1>
        <p className="text-navy/50 font-medium">
          Update the teaching details and attached reading material.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
          <Loader2 className="size-10 animate-spin" />
          <span className="font-bold uppercase tracking-widest text-xs">Fetching Teaching Details...</span>
        </div>
      ) : teaching ? (
        <TeachingForm initialData={teaching} isEditing={true} />
      ) : (
        <div className="bg-red-50 text-red-500 p-10 rounded-3xl border border-red-100 font-bold text-center">
          Teaching not found or an error occurred.
        </div>
      )}
    </div>
  );
}
