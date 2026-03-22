"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useTranslation } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, ArrowLeft, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditMonthlyDonorModal } from "@/components/admin/donations/EditMonthlyDonorModal";
import { AddDonationModal } from "@/components/admin/donations/AddDonationModal";
import { DataTable, Column } from "@/components/admin/DataTable";

export default function AdminMonthlyDonorsPage() {
  const { t } = useTranslation();
  const [donors, setDonors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [meta, setMeta] = useState<any | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const limit = 20;

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/donations/monthly-donor-subscriptions", {
        params: { 
          page, 
          limit, 
          search: search.trim(),
          sortBy,
          sortOrder,
          ...(categoryFilter ? { category: categoryFilter } : {})
        },
      });
      setDonors(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDonors();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, sortOrder, categoryFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    setSavingId(id);
    try {
      await api.put(`/donations/monthly-donor-subscriptions/${id}`, { status: newStatus });
      fetchDonors();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const deleteDonor = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/donations/monthly-donor-subscriptions/${id}`);
      fetchDonors();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const columns: Column<any>[] = [
    {
      id: "name",
      header: "Donor Name",
      sortable: true,
      cell: (donor) => (
        <div>
          <p className="font-bold text-navy text-base">{donor.name}</p>
          {donor.remarks && (
            <p className="text-xs text-navy/50 italic mt-1 line-clamp-1 max-w-[200px]" title={donor.remarks}>
              {donor.remarks}
            </p>
          )}
        </div>
      )
    },
    {
      id: "phone",
      header: "Contact",
      accessorKey: "phone",
    },
    {
      id: "amount",
      header: "Commitment",
      sortable: true,
      cell: (donor) => (
        <p className="whitespace-nowrap">
          <span className="font-black text-gold text-base">
            {donor.amount.toLocaleString()}
          </span>{" "}
          <span className="text-xs font-black text-navy/40 uppercase">
            {donor.currency}
          </span>
        </p>
      )
    },
    {
      id: "category",
      header: "Category",
      sortable: true,
      cell: (donor) => (
        <Badge variant="outline" className="bg-navy/5 text-navy/70 border-navy/10 capitalize">
          {t(`donors.monthly.categories.${donor.category || 'general'}`)}
        </Badge>
      )
    },
    {
      id: "startDate",
      header: "Start Date",
      sortable: true,
      cell: (donor) => new Date(donor.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })
    },
    {
      id: "endDate",
      header: "End Date",
      sortable: true,
      cell: (donor) => donor.endDate ? (
        <span className="font-bold text-navy/70">
          {new Date(donor.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
        </span>
      ) : (
        <span className="text-navy/30 italic font-myanmar">မရှိသေးပါ</span>
      )
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (donor) => (
        <Badge
          className={
            donor.status === "active"
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : donor.status === "pending"
              ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20"
          }
        >
          {donor.status}
        </Badge>
      )
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-center",
      hideable: false,
      cell: (donor) => (
        <div className="flex items-center justify-center gap-2">
          {donor.status === "pending" && (
            <div className="flex gap-2">
              <button
                disabled={savingId === donor.id}
                onClick={() => updateStatus(donor.id, "active")}
                className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
              >
                <Check className="size-4" />
              </button>
              <button
                disabled={savingId === donor.id}
                onClick={() => updateStatus(donor.id, "inactive")}
                className="size-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors border border-red-200"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
          {donor.status === "active" && (
            <button
              disabled={savingId === donor.id}
              onClick={() => updateStatus(donor.id, "inactive")}
              className="size-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors border border-yellow-200"
            >
              <X className="size-4" />
            </button>
          )}
          {donor.status === "inactive" && (
            <button
              disabled={savingId === donor.id}
              onClick={() => updateStatus(donor.id, "active")}
              className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
            >
              <Check className="size-4" />
            </button>
          )}

          {donor.status === "active" && (
            <AddDonationModal
              onSuccess={() => alert("Donation recorded!")}
              initialData={{
                donorName: donor.name,
                amount: donor.amount.toString(),
                currency: donor.currency,
                category: donor.category,
              }}
              triggerButton={
                <button className="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 border border-purple-200">
                  <Banknote className="size-4" />
                </button>
              }
            />
          )}

          <EditMonthlyDonorModal donor={donor} onSuccess={fetchDonors} />

          <button
            disabled={savingId === donor.id}
            onClick={() => deleteDonor(donor.id)}
            className="size-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 border border-red-200"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy tracking-tight mb-2 uppercase">
            Monthly Donors <span className="text-gold">Subscriptions</span>
          </h1>
          <p className="text-navy/60 font-medium">
            Manage recurring commitments (Total: {meta?.total ?? 0})
          </p>
        </div>
        <Link href="/admin/donations">
          <Button variant="outline" className="h-14 border-gold/20 rounded-2xl px-8 font-black text-navy/70 text-sm hover:bg-gold/10">
            <ArrowLeft className="mr-2 size-5" /> Back to Donations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["MMK", "USD", "THB", "SGD"].map((curr) => {
          const amount = meta?.totalsByCurrency?.find((t: any) => t.currency === curr)?.total || 0;
          return (
            <div key={curr} className="bg-cream/20 p-6 rounded-[2rem] border border-gold/10">
              <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em] mb-1">{curr}</p>
              <p className="text-2xl font-black text-navy">{amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={donors}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by name, phone..."
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
      </DataTable>
    </div>
  );
}
