"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, HandCoins, ArrowLeft } from "lucide-react";

type MonthlyDonorRow = {
  donorName: string;
  currency: string;
  totalAmount: number;
  donationCount: number;
  lastDonationAt: string | null;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function monthLabel(month: number) {
  const date = new Date(Date.UTC(2020, month - 1, 1));
  return date.toLocaleString("en-US", { month: "long" });
}

export default function AdminMonthlyDonorsPage() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(now.getUTCFullYear());
  const [month, setMonth] = useState<number>(now.getUTCMonth() + 1);

  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<MonthlyDonorRow[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<MonthlyDonorRow>["meta"] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchMonthly = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<PaginatedResponse<MonthlyDonorRow>>("/donations/monthly-donors", {
          params: { year, month, page: 1, limit: 200 },
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

    fetchMonthly();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const years = useMemo(() => {
    const currentYear = now.getUTCFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, [now]);

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
            Monthly <span className="text-gold">Donors</span>
          </h1>
          <p className="text-navy/50 font-myanmar font-medium">
            Aggregated donors list for the selected month.
          </p>
        </div>
        <Link href="/admin/donations">
          <Button variant="outline" className="h-14 border-gold/20 rounded-2xl px-8 font-black text-navy/70">
            <ArrowLeft className="mr-2 size-5" /> Back to Donations
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-gold/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="size-6 text-gold" />
          <p className="text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
            Month filter
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="h-12 w-full sm:w-56 rounded-2xl bg-cream/30 border border-gold/10 px-4 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-12 w-full sm:w-40 rounded-2xl bg-cream/30 border border-gold/10 px-4 text-navy font-bold outline-none focus:ring-2 focus:ring-maroon/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-maroon/30">
            <Loader2 className="size-10 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">Loading Monthly Donors...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-navy/30">
            <HandCoins className="size-12" />
            <p className="font-bold">No donors found for this month.</p>
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
                    Total
                  </th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Count
                  </th>
                  <th className="p-6 text-xs font-black text-navy/40 uppercase tracking-[0.2em]">
                    Last Donation
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={`${r.donorName}-${r.currency}-${idx}`} className="border-b border-gold/5 hover:bg-cream/20 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-navy tracking-tight">{r.donorName}</p>
                      <p className="text-xs font-black text-navy/30 uppercase tracking-widest mt-1">{r.currency}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-maroon text-lg">
                        {Number(r.totalAmount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-gold/10 text-gold border border-gold/20 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        {r.donationCount}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-navy/60">
                        {r.lastDonationAt ? new Date(r.lastDonationAt).toLocaleString() : "-"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-navy/30 uppercase tracking-widest">
          Showing {rows.length} {meta?.total ? `/ ${meta.total}` : ""}
        </p>
        <p className="text-xs font-black text-navy/30 uppercase tracking-widest">
          {monthLabel(month)} {year}
        </p>
      </div>
    </div>
  );
}

