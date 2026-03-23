"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { HandCoins, History } from "lucide-react";
import { AddDonationModal } from "@/components/admin/donations/AddDonationModal";
import { DataTable, Column } from "@/components/admin/DataTable";

export default function AdminDonationsPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const limit = 20;

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/donations/${id}`, { status: newStatus });
      setRefreshKey(k => k + 1);
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const deleteDonation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      await api.delete(`/donations/${id}`);
      setRefreshKey(k => k + 1);
    } catch (e) {
      console.error(e);
      alert("Failed to delete donation.");
    }
  };


  useEffect(() => {
    let cancelled = false;
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/donations", {
          params: { 
            page, 
            limit, 
            search: search.trim(),
            sortBy,
            sortOrder,
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(statusFilter ? { status: statusFilter } : {})
          },
        });
        if (cancelled) return;
        setRows(res.data.data ?? []);
        setMeta(res.data.meta ?? null);
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setMeta(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchDonations, 300);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [page, search, refreshKey, sortBy, sortOrder, categoryFilter, statusFilter]);

  const columns: Column<any>[] = [
    {
      id: "donorName",
      header: "Donor",
      sortable: true,
      accessorKey: "donorName",
      cell: (d) => <p className="font-black text-navy tracking-tight">{d.donorName}</p>
    },
    {
      id: "amount",
      header: "Amount",
      sortable: true,
      cell: (d) => (
        <div className="flex items-baseline gap-2">
          <p className="font-black text-maroon text-lg">
            {Number(d.amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs font-black text-navy/40 uppercase tracking-widest">{d.currency}</p>
        </div>
      )
    },
    {
      id: "category",
      header: "Category",
      sortable: true,
      cell: (d) => (
        <Badge variant="outline" className="bg-navy/5 text-navy/70 border-navy/10 capitalize">
          {t(`donors.monthly.categories.${d.category || 'general'}`)}
        </Badge>
      )
    },
    {
      id: "message",
      header: "Message",
      className: "max-w-xl",
      cell: (d) => <p className="text-sm text-navy/60 line-clamp-2">{d.message || "-"}</p>
    },
    {
      id: "date",
      header: "Date",
      sortable: true,
      cell: (d) => {
        const date = d.date || d.createdAt;
        return (
          <p className="text-sm font-bold text-navy/60">
            {date ? new Date(date).toLocaleString() : "-"}
          </p>
        );
      }
    },
    {
      id: "status",
      header: "Status / Slip",
      cell: (d) => (
        <div className="flex flex-col gap-2 items-start">
          <Badge 
            variant="outline" 
            className={`capitalize ${d.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}`}
          >
            {d.status || "approved"}
          </Badge>
          {d.slipUrl && (
            <a href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api${d.slipUrl}`} target="_blank" rel="noreferrer" className="text-[10px] text-maroon font-bold uppercase tracking-widest hover:underline whitespace-nowrap">
               View Slip
            </a>
          )}
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      cell: (d) => (
        <div className="flex items-center justify-end gap-2 text-right">
          {(!d.status || d.status === "pending") && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
              onClick={() => updateStatus(d.id, "approved")}
            >
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
            onClick={() => deleteDonation(d.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Donations <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            View all donations submitted (Total: {meta?.total ?? 0})
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-end">
          <AddDonationModal onSuccess={() => setRefreshKey(k => k + 1)} />
          <Link href="/admin/monthly-donors/report">
            <Button className="h-14 bg-navy hover:bg-navy/80 text-white rounded-2xl px-6 font-black text-base shadow-lg shadow-navy/20">
              <History className="mr-2 size-5" /> Reports
            </Button>
          </Link>
          <Link href="/admin/monthly-donors">
            <Button className="h-14 bg-gold hover:bg-gold/80 text-navy rounded-2xl px-6 font-black text-base shadow-lg shadow-gold/20">
              <HandCoins className="mr-2 size-5" /> Subscriptions
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["MMK", "USD", "THB", "SGD"].map((curr) => {
          const amount = meta?.totalsByCurrency?.find((t: any) => t.currency === curr)?.total || 0;
          return (
            <div key={curr} className="bg-cream/20 p-6 rounded-[2rem] border border-gold/10">
              <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em] mb-1">{curr}</p>
              <p className="text-2xl font-black text-maroon">{amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(f, o) => { setSortBy(f); setSortOrder(o); }}
        page={page}
        totalPages={meta?.totalPages || 1}
        total={meta?.total}
        onPageChange={setPage}
      >
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="h-12 bg-cream/30 border-none rounded-xl px-4 focus:ring-2 focus:ring-maroon/20 outline-none font-bold text-navy/70 text-sm cursor-pointer"
        >
          <option value="">All Categories</option>
          {["robes", "alms", "monastery", "medicine", "education", "general"].map(cat => (
            <option key={cat} value={cat}>{t(`donors.monthly.categories.${cat}`)}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-12 bg-cream/30 border-none rounded-xl px-4 focus:ring-2 focus:ring-maroon/20 outline-none font-bold text-navy/70 text-sm cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </DataTable>
    </div>
  );
}
