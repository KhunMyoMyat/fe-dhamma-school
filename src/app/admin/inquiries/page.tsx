"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  Eye,
  Mail,
  MailOpen,
  User,
  AtSign,
  Calendar,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataTable, Column } from "@/components/admin/DataTable";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 10;

  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/contact", {
        params: {
          page,
          limit,
          search: search.trim(),
          sortBy,
          sortOrder
        }
      });
      setInquiries(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInquiries();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, sortOrder]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);
      toast.success("Marked as read!");
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, isRead: true });
      }
    } catch (error) {
      toast.error("Failed to mark as read.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Message deleted!");
      fetchInquiries();
      setIsDetailsOpen(false);
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const columns: Column<any>[] = [
    {
      id: "isRead",
      header: "Status",
      sortable: true,
      className: "w-20",
      cell: (inquiry) => (
        <div className="flex items-center justify-center">
          {inquiry.isRead ? (
            <MailOpen className="size-5 text-navy/20" />
          ) : (
            <div className="relative">
              <Mail className="size-5 text-gold-dark" />
              <span className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          )}
        </div>
      )
    },
    {
      id: "name",
      header: "Sender",
      sortable: true,
      cell: (inquiry) => (
        <div>
          <p className={cn(
            "font-black text-lg leading-none mb-1",
            inquiry.isRead ? "text-navy/60" : "text-maroon"
          )}>
            {inquiry.name}
          </p>
          <p className="text-xs text-navy/40 font-bold">{inquiry.email}</p>
        </div>
      )
    },
    {
      id: "subject",
      header: "Subject",
      sortable: true,
      cell: (inquiry) => (
        <p className={cn(
          "font-bold truncate max-w-[200px] text-sm",
          inquiry.isRead ? "text-navy/50" : "text-navy"
        )}>
          {inquiry.subject}
        </p>
      )
    },
    {
      id: "createdAt",
      header: "Received",
      sortable: true,
      cell: (inquiry) => (
        <p className="text-xs font-black text-navy/30 uppercase tracking-widest whitespace-nowrap">
          {new Date(inquiry.createdAt).toLocaleString()}
        </p>
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      hideable: false,
      cell: (inquiry) => (
        <div className="flex items-center justify-end gap-2">
          {!inquiry.isRead && (
            <button 
              onClick={() => handleMarkAsRead(inquiry.id)}
              className="p-2 hover:bg-gold/10 rounded-lg text-gold hover:text-gold-dark transition-colors"
              title="Mark as Read"
            >
              <CheckCircle2 className="size-5" />
            </button>
          )}
          <button 
            onClick={() => {
              setSelectedInquiry(inquiry);
              setIsDetailsOpen(true);
            }}
            className="p-2 hover:bg-maroon/5 rounded-lg text-navy/30 hover:text-maroon transition-colors"
          >
            <Eye className="size-5" />
          </button>
          <button 
            onClick={() => handleDelete(inquiry.id)}
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
            Contact <span className="text-gold">Inquiries</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            Contact messages management (Total - {total})
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={inquiries}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="အမည်၊ အီးမေးလ် သို့မဟုတ် ခေါင်းစဉ်ဖြင့် ရှာဖွေပါ..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(f, o) => { setSortBy(f); setSortOrder(o); }}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-cream border-gold/20 rounded-[2rem] p-0 overflow-hidden outline-none">
          {selectedInquiry && (
            <div className="flex flex-col">
              <div className="h-2 bg-linear-to-r from-maroon via-gold to-maroon" />
              <DialogHeader className="p-8 pb-4 text-left">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl font-black text-maroon uppercase tracking-tight">
                      Message <span className="text-gold">Details</span>
                    </DialogTitle>
                    <DialogDescription className="font-myanmar font-medium">
                      ပေးပို့လာသော စာသားအသေးစိတ်
                    </DialogDescription>
                  </div>
                  {!selectedInquiry.isRead && (
                    <Badge className="bg-gold/10 text-gold-dark border-gold/20 font-black tracking-widest">UNREAD</Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 border border-gold/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-navy/30 text-[10px] font-black uppercase tracking-widest mb-1">
                      <User className="size-3" /> Sender Name
                    </div>
                    <p className="font-black text-maroon">{selectedInquiry.name}</p>
                  </div>
                  <div className="bg-white/50 border border-gold/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-navy/30 text-[10px] font-black uppercase tracking-widest mb-1">
                      <AtSign className="size-3" /> Email Address
                    </div>
                    <p className="font-black text-navy/70 break-all">{selectedInquiry.email}</p>
                  </div>
                </div>

                <div className="bg-white/50 border border-gold/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-navy/30 text-[10px] font-black uppercase tracking-widest mb-1">
                    <Calendar className="size-3" /> Date Received
                  </div>
                  <p className="font-bold text-navy/60">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>

                <div className="bg-white/80 border border-gold/10 rounded-3xl p-6 min-h-[150px] shadow-inner">
                   <div className="flex items-center gap-2 text-navy/30 text-[10px] font-black uppercase tracking-widest mb-4">
                    <MessageSquare className="size-3" /> Message Content
                  </div>
                  <p className="text-navy leading-relaxed font-semibold">
                    {selectedInquiry.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                  <Button 
                    variant="ghost" 
                    className="rounded-xl font-bold text-navy/40 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(selectedInquiry.id)}
                  >
                    Delete Message
                  </Button>
                  {!selectedInquiry.isRead && (
                    <Button 
                      className="bg-gold hover:bg-gold-dark text-white rounded-xl px-6 font-black tracking-wide"
                      onClick={() => handleMarkAsRead(selectedInquiry.id)}
                    >
                      <CheckCircle2 className="mr-2 size-5" /> Mark as Read
                    </Button>
                  )}
                  <Button 
                    className="bg-maroon hover:bg-maroon-light text-white rounded-xl px-8 font-black tracking-wide"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
