"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Eye, 
  EyeOff,
  Search,
  Settings2,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  hideable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  // Sorting
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string, order: "asc" | "desc") => void;
  // Pagination
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  // Search
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Extra filters
  children?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  page,
  totalPages,
  total,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
}: DataTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.id)
  );
  const [showSettings, setShowSettings] = useState(false);

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSort = (id: string) => {
    if (!onSort) return;
    if (sortBy === id) {
      onSort(id, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(id, "desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gold/10 shadow-sm">
        {onSearchChange && (
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-navy/20 group-focus-within:text-maroon transition-colors" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 bg-cream/30 border-none rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-maroon/20 outline-none font-medium text-navy"
            />
          </div>
        )}
        
        {children}

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="h-12 border-gold/20 rounded-xl px-4 flex gap-2 font-bold text-navy/60"
          >
            <Settings2 className="size-5" />
            Columns
          </Button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gold/20 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-3 ml-1">Visible Columns</p>
              <div className="space-y-1">
                {columns.filter(c => c.hideable !== false).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => toggleColumn(col.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold transition-colors text-left",
                      visibleColumns.includes(col.id) 
                        ? "bg-maroon/5 text-maroon" 
                        : "text-navy/40 hover:bg-navy/5"
                    )}
                  >
                    {col.header}
                    {visibleColumns.includes(col.id) ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-gold/10 shadow-xl shadow-maroon/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/40 border-b border-gold/10">
                {columns
                  .filter((c) => visibleColumns.includes(c.id))
                  .map((col) => (
                    <th
                      key={col.id}
                      className={cn(
                        "p-6 py-4 text-xs font-black text-navy/40 uppercase tracking-widest",
                        col.sortable && "cursor-pointer hover:text-maroon transition-colors",
                        col.className
                      )}
                      onClick={() => col.sortable && handleSort(col.id)}
                    >
                      <div className="flex items-center gap-1">
                        {col.header}
                        {col.sortable && (
                          sortBy === col.id ? (
                            sortOrder === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                          ) : (
                            <ChevronsUpDown className="size-4 opacity-30" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="text-navy/70 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="p-20 text-center">
                    <Loader2 className="size-10 animate-spin mx-auto text-maroon/20 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-navy/20">Loading Data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="p-20 text-center">
                    <p className="font-bold text-navy/30">No records found.</p>
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="border-b border-gold/5 last:border-none hover:bg-cream/20 transition-colors">
                    {columns
                      .filter((c) => visibleColumns.includes(c.id))
                      .map((col) => (
                        <td key={col.id} className={cn("p-6", col.className)}>
                          {col.cell ? col.cell(item) : (item as any)[col.accessorKey!]}
                        </td>
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
            Page {page} of {totalPages || 1}
          </p>
          {total !== undefined && (
            <p className="text-[10px] font-bold text-maroon/40 uppercase tracking-widest">
              Total {total} Records
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-gold/20 font-bold text-navy/60"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ArrowLeft className="size-4 mr-2" /> Prev
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-gold/20 font-bold text-navy/60"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
