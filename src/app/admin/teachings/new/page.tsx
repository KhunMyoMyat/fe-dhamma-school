"use client";

import { TeachingForm } from "@/components/admin/TeachingForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewTeachingPage() {
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
          Create New <span className="text-gold">Teaching</span>
        </h1>
        <p className="text-navy/50 font-medium">
          Add a new teaching and optional reading material.
        </p>
      </div>

      <TeachingForm />
    </div>
  );
}
