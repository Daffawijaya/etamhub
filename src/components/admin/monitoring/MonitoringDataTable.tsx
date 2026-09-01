"use client";

import { useState, useEffect, useCallback } from "react";
import UmkmSearch from "../UmkmSearch";
import MonitoringFilters from "./MonitoringFilters";
import MonitoringTable from "./MonitoringTable";
import UmkmPagination from "../umkm/UmkmPagination";
import LoadingState from "@/components/LoadingState";

interface MonitoringItem {
  id: string;
  nama: string;
  pemilik: string | null;
  kategori: string;
  kecamatan: string;
  gambar: string[];
  latestMonitoring: {
    id: string;
    created_at: string;
    omzet: number | null;
    jumlah_tenaga_kerja: number | null;
  } | null;
  monitoringCount: number;
  badge: {
    level: string;
    label: string;
    color: string;
    bgColor: string;
    description: string;
  };
}

interface Props {
  limit?: number;
}

interface AppliedFilters {
  search: string;
  sort: string;
  kecamatan: string;
  badge: string;
  monitored: string;
  omzetMin: string;
  omzetMax: string;
}

const DEFAULT_FILTERS: AppliedFilters = {
  search: "",
  sort: "terbaru",
  kecamatan: "all",
  badge: "all",
  monitored: "all",
  omzetMin: "",
  omzetMax: "",
};

export default function MonitoringDataTable({ limit = 10 }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MonitoringItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Applied filters (used for API fetch)
  const [applied, setApplied] = useState<AppliedFilters>(DEFAULT_FILTERS);

  // Draft filters (shown in FilterSheet UI)
  const [draft, setDraft] = useState<AppliedFilters>(DEFAULT_FILTERS);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort: applied.sort,
      order: applied.sort === "terbaru" ? "desc" : applied.sort === "nama" ? "asc" : "desc",
    });

    if (applied.search) params.append("search", applied.search);
    if (applied.kecamatan !== "all") params.append("kecamatan", applied.kecamatan);
    if (applied.badge !== "all") params.append("badge", applied.badge);
    if (applied.monitored !== "all") params.append("monitored", applied.monitored);
    if (applied.omzetMin) params.append("omzet_min", applied.omzetMin);
    if (applied.omzetMax) params.append("omzet_max", applied.omzetMax);

    try {
      const res = await fetch(`/api/admin/monitoring?${params}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Gagal memuat data");
        return;
      }

      setData(Array.isArray(result.data) ? result.data : []);
      setTotal(result.total ?? 0);
      setKecamatanOptions(["all", ...(result.filters?.kecamatan ?? [])]);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, [page, limit, applied]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  // Search applies immediately (typing in search bar)
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setApplied((f) => ({ ...f, search: value }));
    setPage(1);
  }, []);

  // Apply: copy draft → applied (triggers fetch)
  const handleApply = useCallback(() => {
    setApplied({ ...draft, search });
    setPage(1);
  }, [draft, search]);

  // Reset: clear both
  const handleReset = useCallback(() => {
    const reset: AppliedFilters = { ...DEFAULT_FILTERS, search };
    setDraft(reset);
    setApplied(reset);
    setPage(1);
  }, [search]);

  return (
    <div
      className="overflow-visible rounded-2xl bg-white dark:bg-dark-card transition-colors duration-300"
    >
      {/* Header */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Monitoring UMKM
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Pantau perkembangan UMKM di kecamatan Anda
            </p>
          </div>

          {/* Search + Filter — right side */}
          <div className="flex items-center gap-2">
            <UmkmSearch
              value={search}
              onChange={handleSearch}
            />

            <MonitoringFilters
              badge={draft.badge}
              monitored={draft.monitored}
              omzetMin={draft.omzetMin}
              omzetMax={draft.omzetMax}
              kecamatan={draft.kecamatan}
              sort={draft.sort}
              kecamatanOptions={kecamatanOptions}
              onBadgeChange={(v) => setDraft((f) => ({ ...f, badge: v }))}
              onMonitoredChange={(v) => setDraft((f) => ({ ...f, monitored: v }))}
              onOmzetMinChange={(v) => setDraft((f) => ({ ...f, omzetMin: v }))}
              onOmzetMaxChange={(v) => setDraft((f) => ({ ...f, omzetMax: v }))}
              onKecamatanChange={(v) => setDraft((f) => ({ ...f, kecamatan: v }))}
              onSortChange={(v) => setDraft((f) => ({ ...f, sort: v }))}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-0">
        {loading ? (
          <div className="py-12">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-500">
            {error}
          </div>
        ) : (
          <>
            <MonitoringTable data={data} />
            <UmkmPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
