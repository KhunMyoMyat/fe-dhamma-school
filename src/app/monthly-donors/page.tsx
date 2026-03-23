"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useTranslation } from "@/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Loader2, Search, Sparkles } from "lucide-react";
import { RegisterMonthlyDonorModal } from "@/components/donors/RegisterMonthlyDonorModal";

type MonthlyDonorRow = {
  donorName: string;
  currency: string;
  category: string;
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

export default function MonthlyDonorsPage() {
  const { t } = useTranslation();
  const now = useMemo(() => new Date(), []);

  const [year, setYear] = useState<number>(now.getUTCFullYear());
  const [month, setMonth] = useState<number>(now.getUTCMonth() + 1);

  const [rows, setRows] = useState<MonthlyDonorRow[]>([]);
  type MonthlyDonorMeta = PaginatedResponse<MonthlyDonorRow>["meta"] & { totalsByCurrency?: { currency: string; total: number }[] };
  const [meta, setMeta] = useState<MonthlyDonorMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("totalAmount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState("");
  const limit = 20;

  useEffect(() => {
    let cancelled = false;

    const fetchMonthlyDonors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<PaginatedResponse<MonthlyDonorRow> & { meta: { totalsByCurrency: any[] } }>("/donations/monthly-donors", {
          params: { 
            year, 
            month, 
            page, 
            limit,
            search: search.trim(),
            sortBy,
            sortOrder,
            category
          },
        });
        if (cancelled) return;
        setRows(res.data.data ?? []);
        setMeta(res.data.meta ?? null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.message || "Failed to load monthly donors.");
        setRows([]);
        setMeta(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchMonthlyDonors, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [year, month, page, search, sortBy, sortOrder, category]);

  const years = useMemo(() => {
    const currentYear = now.getUTCFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, [now]);

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-maroon/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 flex flex-col items-center">
          <Badge className="bg-gold/20 text-gold mb-6 border-gold/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
            {t("donors.monthly.badge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            {t("donors.monthly.title")}
          </h1>
          <p className="mt-4 text-cream/60 font-myanmar text-lg mb-8 max-w-2xl mx-auto">
            {t("donors.monthly.subtitle")}
          </p>
          <RegisterMonthlyDonorModal />
        </div>

        <div className="max-w-4xl mx-auto mb-10 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 text-gold">
              <Sparkles className="size-6" />
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                {t("donors.monthly.filter")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                value={month}
                onChange={(e) => { setMonth(Number(e.target.value)); setPage(1); }}
                className="h-12 w-full sm:w-56 rounded-2xl bg-navy/60 border border-white/10 px-4 text-white font-bold outline-none focus:border-gold/60"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => { setYear(Number(e.target.value)); setPage(1); }}
                className="h-12 w-full sm:w-40 rounded-2xl bg-navy/60 border border-white/10 px-4 text-white font-bold outline-none focus:border-gold/60"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-cream/20 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder={t("contact.form.name") + "..."}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full h-12 bg-navy/40 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold outline-none focus:border-gold/60"
              />
            </div>

            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="h-12 w-full rounded-2xl bg-navy/40 border border-white/10 px-4 text-white font-bold outline-none focus:border-gold/60"
            >
              <option value="">{t("donors.monthly.categories.label")} (All)</option>
              {["robes", "alms", "monastery", "medicine", "education", "general"].map((cat) => (
                <option key={cat} value={cat}>
                  {t(`donors.monthly.categories.${cat}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="size-10 text-gold animate-spin mb-4" />
              <p className="text-cream/40 font-bold uppercase tracking-widest text-xs">
                {t("common.loading")}
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[2.5rem] bg-maroon/20 border border-maroon/30 p-8 text-center">
              <p className="text-cream/80 font-bold">{error}</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-10 text-center">
              <p className="text-cream/60 font-bold">{t("donors.monthly.empty")}</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md">
                <p className="text-xs font-black text-gold/60 uppercase tracking-[0.2em] mb-6 text-center">
                  {t("donors.monthly.total_stats")} ({monthLabel(month)} {year})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {["MMK", "USD", "THB", "SGD"].map((curr) => {
                    const amount = meta?.totalsByCurrency?.find(t => t.currency === curr)?.total || 0;
                    return (
                      <div key={curr} className="text-center group">
                        <p className="text-2xl md:text-3xl font-black text-white group-hover:text-gold transition-colors">
                          {amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-black text-cream/40 uppercase tracking-widest mt-1">
                          {curr}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-cream/40 font-bold uppercase tracking-widest px-2">
                  <span>
                    {t("donors.monthly.showing")} {rows.length}
                    {meta?.total ? ` / ${meta.total}` : ""}
                  </span>
                  <span className="text-gold/60">
                    {monthLabel(month)} {year}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th 
                          className="px-8 py-6 text-xs font-black text-gold/60 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors"
                          onClick={() => {
                            const nextOrder = sortBy === "donorName" && sortOrder === "asc" ? "desc" : "asc";
                            setSortBy("donorName");
                            setSortOrder(nextOrder);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {t("contact.form.name")}
                            {sortBy === "donorName" && (sortOrder === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />)}
                          </div>
                        </th>
                        <th className="px-8 py-6 text-xs font-black text-gold/60 uppercase tracking-widest">
                          {t("donors.monthly.categories.label")}
                        </th>
                        <th 
                          className="px-8 py-6 text-xs font-black text-gold/60 uppercase tracking-widest text-right cursor-pointer hover:text-gold transition-colors"
                          onClick={() => {
                            const nextOrder = sortBy === "totalAmount" && sortOrder === "asc" ? "desc" : "asc";
                            setSortBy("totalAmount");
                            setSortOrder(nextOrder);
                          }}
                        >
                          <div className="flex items-center justify-end gap-2">
                            {sortBy === "totalAmount" && (sortOrder === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />)}
                            {t("donors.monthly.donations")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row, idx) => (
                        <tr
                          key={`${row.donorName}-${row.currency}-${row.category}-${idx}`}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-8 py-6">
                            <p className="font-black text-white text-lg tracking-tight group-hover:text-gold transition-colors">
                              {row.donorName}
                            </p>
                            {row.lastDonationAt && (
                              <p className="text-[10px] text-cream/30 font-bold uppercase tracking-widest mt-0.5">
                                {t("donors.monthly.last")}:{" "}
                                {new Date(row.lastDonationAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                })}
                              </p>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <Badge
                              variant="outline"
                              className="bg-white/5 border-white/10 text-cream/60 capitalize font-bold px-3 py-1 rounded-full text-[11px]"
                            >
                              {t(`donors.monthly.categories.${row.category || "general"}`)}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex flex-col items-end">
                              <p className="text-xl font-black text-white group-hover:text-gold transition-colors">
                                {row.totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                              </p>
                              <p className="text-[10px] text-cream/40 font-black uppercase tracking-widest">
                                {row.currency}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-[10px] font-black text-cream/30 uppercase tracking-[0.2em]">
                      {t("donors.monthly.showing")} {rows.length} / {meta.total}
                    </p>
                    <div className="flex gap-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="size-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 transition-all font-bold"
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <button
                        disabled={page >= meta.totalPages}
                        onClick={() => setPage(page + 1)}
                        className="size-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 transition-all font-bold"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
