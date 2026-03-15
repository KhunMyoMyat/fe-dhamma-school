"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  Loader2,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/events");
      // Handle paginated response: { data: [...], meta: {...} }
      setEvents(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.titleMm?.includes(search) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const removeEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Events <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            ပွဲတော်များနှင့် အစီအစဉ်များကို စီမံခန့်ခွဲရန် နေရာ (စုစုပေါင်း - {events.length} ခု)
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Event
          </Button>
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gold/10 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/20 group-focus-within:text-maroon transition-colors" />
          <input 
            type="text"
            placeholder="ပွဲအမည် သို့မဟုတ် နေရာဖြင့် ရှာဖွေပါ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-cream/30 border-none rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-maroon/20 outline-none font-myanmar font-medium"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-navy/20">
            <Calendar className="size-12" />
            <p className="font-bold font-myanmar">ရှာဖွေမှု မတွေ့ရှိပါ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 border-b border-gold/10">
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Event Info</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Date & Time</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Location</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="group hover:bg-cream/20 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl relative overflow-hidden border border-gold/20 shrink-0">
                          <Image 
                            src={event.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=200"} 
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-maroon text-lg leading-none mb-1">{event.title}</p>
                          <p className="text-xs text-gold-dark font-myanmar font-medium">{event.titleMm}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-navy/70 font-bold text-sm">
                          <Calendar className="size-4 text-gold" />
                          {formatDate(event.date)}
                          {event.endDate && ` - ${formatDate(event.endDate)}`}
                        </div>
                        <div className="flex items-center gap-2 text-navy/40 text-xs font-medium">
                          <Clock className="size-3" />
                          {formatTime(event.date)}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-navy/70 font-bold text-sm">
                        <MapPin className="size-4 text-maroon/40" />
                        {event.location || "Online / Not Set"}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-2 rounded-full",
                          event.isActive ? "bg-green-500 animate-pulse" : "bg-navy/20"
                        )} />
                        <span className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          event.isActive ? "text-green-600" : "text-navy/30"
                        )}>
                          {event.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/events/${event.id}`} target="_blank">
                          <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="View on Site">
                            <Eye className="size-5" />
                          </button>
                        </Link>
                        <Link href={`/admin/events/${event.id}`}>
                          <button className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors" title="Edit Event">
                            <Edit2 className="size-5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => removeEvent(event.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-navy/30 hover:text-red-500 transition-colors" 
                          title="Delete Event"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
