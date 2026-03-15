"use client";

import { EventForm } from "@/components/admin/EventForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/events" 
          className="flex items-center gap-2 text-navy/40 hover:text-maroon transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="size-4" /> Back to Events
        </Link>
        <h1 className="text-4xl font-black text-maroon tracking-tight uppercase">
          Add New <span className="text-gold">Event</span>
        </h1>
      </div>

      <EventForm />
    </div>
  );
}
