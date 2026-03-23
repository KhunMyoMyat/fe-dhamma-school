"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 10;
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/events", {
        params: {
          page,
          limit,
          search: search.trim(),
          sortBy,
          sortOrder
        }
      });
      setEvents(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | null) => {
    if (typeof id === "string") {
      setEventToDelete(id);
      setIsDeleteModalOpen(true);
      return;
    }

    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/events/${eventToDelete}`);
      toast.success("Event deleted successfully!");
      fetchEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error("Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, sortOrder]);

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

  const columns: Column<any>[] = [
    {
      id: "title",
      header: "Event Info",
      sortable: true,
      cell: (event) => (
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
      )
    },
    {
      id: "date",
      header: "Date & Time",
      sortable: true,
      cell: (event) => (
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
      )
    },
    {
      id: "location",
      header: "Location",
      sortable: true,
      cell: (event) => (
        <div className="flex items-center gap-2 text-navy/70 font-bold text-sm">
          <MapPin className="size-4 text-maroon/40" />
          {event.location || "Online / Not Set"}
        </div>
      )
    },
    {
      id: "isActive",
      header: "Status",
      sortable: true,
      cell: (event) => (
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
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      hideable: false,
      cell: (event) => (
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
            onClick={() => handleDelete(event.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-navy/30 hover:text-red-500 transition-colors" 
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Events <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            ပွဲတော်များနှင့် အစီအစဉ်များကို စီမံခန့်ခွဲရန် နေရာ (စုစုပေါင်း - {total} ခု)
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="h-14 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl px-8 font-black text-lg shadow-lg shadow-maroon/20">
            <Plus className="mr-2 size-6" /> Add New Event
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={events}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="ပွဲအမည် သို့မဟုတ် နေရာဖြင့် ရှာဖွေပါ..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(f, o) => { setSortBy(f); setSortOrder(o); }}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />
 
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and will remove all related data."
        variant="danger"
        confirmText="Yes, Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
