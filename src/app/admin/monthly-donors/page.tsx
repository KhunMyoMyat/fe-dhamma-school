"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Check, X, Pencil, Trash2, ArrowLeft, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditMonthlyDonorModal } from "@/components/admin/donations/EditMonthlyDonorModal";
import { AddDonationModal } from "@/components/admin/donations/AddDonationModal";

type MonthlyDonorSubscription = {
  id: string;
  name: string;
  phone: string | null;
  amount: number;
  currency: string;
  startDate: string;
  status: string;
  remarks: string | null;
  createdAt: string;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export default function AdminMonthlyDonorsPage() {
  const [donors, setDonors] = useState<MonthlyDonorSubscription[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<MonthlyDonorSubscription>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<PaginatedResponse<MonthlyDonorSubscription>>("/donations/monthly-donor-subscriptions", {
        params: { search, page, limit },
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
  }, [search, page]);

  const updateStatus = async (id: string, newStatus: string) => {
    setSavingId(id);
    try {
      await api.put(`/donations/monthly-donor-subscriptions/${id}`, { status: newStatus });
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const deleteDonor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    setSavingId(id);
    try {
      await api.delete(`/donations/monthly-donor-subscriptions/${id}`);
      fetchDonors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-navy">
            Monthly Donors <span className="text-gold">Subscriptions</span>
          </h1>
          <p className="text-navy/60 font-medium mt-2">
            Manage recurring monthly donor commitments.
          </p>
        </div>
        <Link href="/admin/donations">
          <Button variant="outline" className="h-14 border-gold/20 rounded-2xl px-8 font-black text-navy/70 text-sm hover:bg-gold/10">
            <ArrowLeft className="mr-2 size-5" /> Back to Donations
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-navy/5 border border-navy/5 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-navy/5 bg-cream/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/40" />
            <input
              type="text"
              placeholder="Search by name, phone, remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-navy/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-navy outline-none focus:border-gold/50 focus:ring-4 focus:ring-gold/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy/5 text-navy/60 text-xs font-black uppercase tracking-widest">
                <th className="p-6 py-4">Donor Name</th>
                <th className="p-6 py-4">Contact</th>
                <th className="p-6 py-4">Commitment</th>
                <th className="p-6 py-4">Start Date</th>
                <th className="p-6 py-4">Status</th>
                <th className="p-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-navy/80 text-sm font-medium divide-y divide-navy/5">
              {isLoading && donors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="size-8 animate-spin mx-auto text-gold mb-4" />
                    <p className="text-navy/50 font-bold uppercase tracking-widest text-xs">
                      Loading data...
                    </p>
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-navy/50 font-bold">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-cream/20 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-navy text-base">{donor.name}</p>
                      {donor.remarks && (
                        <p className="text-xs text-navy/50 italic mt-1 line-clamp-1 max-w-[200px]" title={donor.remarks}>
                          {donor.remarks}
                        </p>
                      )}
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {donor.phone || "-"}
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <span className="font-black text-gold text-base">
                        {donor.amount.toLocaleString()}
                      </span>{" "}
                      <span className="text-xs font-black text-navy/40 uppercase">
                        {donor.currency}
                      </span>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {new Date(donor.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="p-6">
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
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        {donor.status === "pending" && (
                          <button
                            disabled={savingId === donor.id}
                            onClick={() => updateStatus(donor.id, "active")}
                            title="Approve"
                            className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
                          >
                            <Check className="size-4" />
                          </button>
                        )}
                        {donor.status === "active" && (
                          <button
                            disabled={savingId === donor.id}
                            onClick={() => updateStatus(donor.id, "inactive")}
                            title="Deactivate"
                            className="size-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors border border-yellow-200"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                        {donor.status === "inactive" && (
                          <button
                            disabled={savingId === donor.id}
                            onClick={() => updateStatus(donor.id, "active")}
                            title="Activate"
                            className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
                          >
                            <Check className="size-4" />
                          </button>
                        )}

                        {donor.status === "active" && (
                          <AddDonationModal
                            onSuccess={() => alert("Donation successfully recorded!")}
                            initialData={{
                              donorName: donor.name,
                              amount: donor.amount.toString(),
                              currency: donor.currency,
                            }}
                            triggerButton={
                              <button
                                title="Record Donation"
                                className="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-colors border border-purple-200"
                              >
                                <Banknote className="size-4" />
                              </button>
                            }
                          />
                        )}

                        <EditMonthlyDonorModal donor={donor} onSuccess={fetchDonors} />

                        <button
                          disabled={savingId === donor.id}
                          onClick={() => deleteDonor(donor.id)}
                          title="Delete"
                          className="size-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors border border-red-200"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Details */}
        {meta && meta.totalPages > 1 && (
          <div className="p-6 border-t border-navy/5 bg-cream/10 flex items-center justify-between">
            <p className="text-sm font-bold text-navy/50">
              Page {page} of {meta.totalPages} ({meta.total} records)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl bg-white border border-navy/10 text-navy font-bold text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-navy/10 text-navy font-bold text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
