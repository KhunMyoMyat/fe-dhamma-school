"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, Search, HandCoins, ArrowRight, ArrowLeft } from "lucide-react";
import { AddDonationModal } from "@/components/admin/donations/AddDonationModal";

type Donation = {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  message?: string | null;
  date?: string;
  createdAt?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export default function AdminDonationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<Donation[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Donation>["meta"] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const limit = 20;

  const query = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let cancelled = false;
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<PaginatedResponse<Donation>>("/donations", {
          params: { page, limit, ...(query ? { search: query } : {}) },
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

    fetchDonations();
    return () => {
      cancelled = true;
    };
  }, [page, query, refreshKey]);

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Donations <span className="text-gold">Management</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            View all donations submitted through the site.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-end">
          <AddDonationModal onSuccess={() => setRefreshKey(k => k + 1)} />
          <Link href="/admin/monthly-donors">
            <Button className="h-14 bg-gold hover:bg-gold/80 text-navy rounded-2xl px-6 font-black text-sm md:text-base shadow-lg shadow-gold/20">
              <HandCoins className="mr-2 size-5" /> Subscriptions
            </Button>
          </Link>
          <Link href="/admin/donations/monthly">
            <Button variant="outline" className="h-14 bg-white hover:bg-cream border-maroon/20 text-maroon rounded-2xl px-6 font-black text-sm md:text-base shadow-lg shadow-maroon/5">
              Monthly Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gold/10 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/20 group-focus-within:text-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search donor, currency, message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-12 bg-cream/30 border-none rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-maroon/20 outline-none font-myanmar font-medium"
          />
        </div>
        <Badge className="bg-gold/10 text-gold border border-gold/20 rounded-xl px-4 py-2 font-black text-xs uppercase tracking-widest">
          {meta?.total ?? 0} total
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Donations...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-navy/30">
            <HandCoins className="size-12" />
            <p className="font-bold">No donations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 border-b border-gold/10">
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Donor
                  </th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Amount
                  </th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Message
                  </th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const date = d.date || d.createdAt;
                  return (
                    <tr key={d.id} className="border-b border-gold/5 hover:bg-cream/20 transition-colors">
                      <td className="p-6">
                        <p className="font-black text-navy tracking-tight">{d.donorName}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-baseline gap-2">
                          <p className="font-black text-maroon text-lg">
                            {Number(d.amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs font-black text-navy/40 uppercase tracking-widest">{d.currency}</p>
                        </div>
                      </td>
                      <td className="p-6 max-w-xl">
                        <p className="text-sm text-navy/60 line-clamp-2">{d.message || "-"}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-navy/60">
                          {date ? new Date(date).toLocaleString() : "-"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-navy/30 uppercase tracking-widest">
          Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl border-gold/20 font-bold text-navy/60"
            disabled={(meta?.page ?? page) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ArrowLeft className="size-4 mr-2" /> Prev
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl border-gold/20 font-bold text-navy/60"
            disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

