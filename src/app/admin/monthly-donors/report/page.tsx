"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useTranslation } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, Wallet, Users, LayoutDashboard, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";

export default function AdminMonthlyReportPage() {
  const { t } = useTranslation();
  const now = useMemo(() => new Date(), []);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [meta, setMeta] = useState<any | null>(null);
  const limit = 50;

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/donations/monthly-donor-subscriptions", {
        params: { 
          page, 
          limit, 
          search: search.trim(),
          month,
          year
        },
      });
      setReportData(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [page, search, month, year]);

  const monthLabel = (m: number) => {
    return new Date(2020, m - 1, 1).toLocaleString("en-US", { month: "long" });
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear + 1 - i);
  }, []);

  const columns: Column<any>[] = [
    {
      id: "name",
      header: "Donor Name",
      sortable: true,
      cell: (donor) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-navy">{donor.name}</p>
          <div className="flex gap-1">
             {donor.isSubscriber ? (
               <Badge className="bg-gold/10 text-gold border-gold/20 text-[9px] h-4 font-black">SUBSCRIBER</Badge>
             ) : (
               <Badge className="bg-navy/10 text-navy/40 border-navy/20 text-[9px] h-4 font-black">MANUAL</Badge>
             )}
          </div>
        </div>
      )
    },
    {
      id: "amount",
      header: "Amount",
      cell: (donor) => (
        <p className="whitespace-nowrap">
          <span className="font-black text-navy">{donor.amount.toLocaleString()}</span>{" "}
          <span className="text-[10px] font-black text-navy/40 uppercase">{donor.currency}</span>
        </p>
      )
    },
    {
      id: "paidCurrentMonth",
      header: "Payment Status",
      cell: (donor) => (
        donor.paidCurrentMonth ? (
          <Badge className="bg-green-500 text-white border-none font-bold">PAID</Badge>
        ) : (
          <Badge className="bg-red-500/10 text-red-600 border border-red-500/20 font-bold">UNPAID</Badge>
        )
      )
    },
    {
      id: "category",
      header: "Category",
      cell: (donor) => (
        <Badge variant="outline" className="capitalize text-[10px]">
          {t(`donors.monthly.categories.${donor.category || 'general'}`)}
        </Badge>
      )
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-10 bg-cream/20 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-gold mb-2">
            <LayoutDashboard className="size-5" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Report View</span>
          </div>
          <h1 className="text-4xl font-black text-navy tracking-tight mb-2 uppercase">
            Monthly <span className="text-gold">Reports</span>
          </h1>
          <p className="text-navy/60 font-medium">Performance summary for {monthLabel(month)} {year}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-navy/5 shadow-sm">
           <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="h-10 bg-navy/5 border-none rounded-xl px-3 outline-none font-bold text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>{monthLabel(i+1)}</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-10 bg-navy/5 border-none rounded-xl px-3 outline-none font-bold text-sm"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="w-px h-6 bg-navy/10 mx-1" />
          <Link href="/admin/donations">
            <Button variant="outline" size="sm" className="font-bold border-navy/20 text-navy/70 hover:bg-navy/5">
              <ArrowLeft className="mr-2 size-4" /> Back to Donations
            </Button>
          </Link>
          <Link href="/admin/monthly-donors">
            <Button variant="outline" size="sm" className="font-bold border-gold/20 text-navy hover:bg-gold/10">
              <History className="mr-2 size-4" /> Go to Subscriptions
            </Button>
          </Link>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {["MMK", "USD", "THB", "SGD"].map((curr) => {
          const expected = meta?.totalsByCurrency?.find((t: any) => t.currency === curr)?.total || 0;
          const paid = meta?.report?.paid?.find((t: any) => t.currency === curr)?.total || 0;
          const paidCount = meta?.report?.paid?.find((t: any) => t.currency === curr)?.count || 0;
          const percent = expected > 0 ? Math.min(100, Math.round((paid / expected) * 100)) : 0;

          return (
            <div key={curr} className="bg-white p-6 rounded-[2.5rem] border border-navy/5 shadow-xl shadow-navy/5">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-navy text-white border-none font-black text-[10px] tracking-widest">{curr}</Badge>
                  <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">{monthLabel(month)}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-black text-navy mb-1">{paid.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Received</p>
                       <div className="h-1 flex-1 bg-navy/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{ width: `${percent}%` }} />
                       </div>
                       <p className="text-[10px] font-black text-gold">{percent}%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-navy/30 uppercase tracking-widest mb-1">
                        Donors
                      </p>
                      <p className="font-black text-navy text-sm">{paidCount} Paid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-navy/30 uppercase tracking-widest mb-1">Expected</p>
                      <p className="font-bold text-navy/60 text-sm">{expected.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
        <div className="p-8 border-b border-navy/5 bg-cream/5 flex items-center justify-between gap-4">
          <h3 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2">
            <Users className="size-4 text-gold" /> Donor Details for this month
          </h3>
          <div className="relative w-64">
             <input 
              type="text" 
              placeholder="Filter by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white border border-navy/10 rounded-xl px-4 text-xs font-bold outline-none"
             />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={reportData}
          isLoading={isLoading}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          search={undefined} 
          sortBy={undefined}
          onSort={() => {}}
        />
      </div>
    </div>
  );
}
