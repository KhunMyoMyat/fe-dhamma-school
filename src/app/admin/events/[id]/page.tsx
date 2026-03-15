"use client";

import { useEffect, useState } from "react";
import { EventForm } from "@/components/admin/EventForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${params.id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-maroon/30">
        <Loader2 className="size-10 animate-spin" />
        <span className="font-bold uppercase tracking-widest text-xs">Loading Event Details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-maroon">Event not found</h2>
        <Link href="/admin/events" className="text-gold hover:underline mt-4 block">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/events" 
          className="flex items-center gap-2 text-navy/40 hover:text-maroon transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="size-4" /> Back to Events List
        </Link>
        <h1 className="text-4xl font-black text-maroon tracking-tight uppercase">
          Edit <span className="text-gold">Event</span>
        </h1>
      </div>

      <EventForm initialData={event} isEditing={true} />
    </div>
  );
}
