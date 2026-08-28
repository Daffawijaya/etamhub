"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
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

export default function MonitoringDataTable({ limit = 10 }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nama");
  const [kecamatan, setKecamatan] = useState("all");
  const [badge, setBadge] = useState("all");
  const [monitored, setMonitored] = useState("all");
  const [omzetMin, setOmzetMin] = useState("");
  const [omzetMax, setOmzetMax] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MonitoringItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      order: sort === "nama" ? "asc" : "desc",
    });

    if (search) params.append("search", search);
    if (kecamatan !== "all") params.append("kecamatan", kecamatan);
    if (badge !== "all") params.append("badge", badge);
    if (monitored !== "all") params.append("monitored", monitored);
    if (omzetMin) params.append("omzet_min", omzetMin);
    if (omzetMax) params.append("omzet_max", omzetMax);

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
  }, [page, limit, search, sort, kecamatan, badge, monitored, omzetMin, omzetMax]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        bg-white
        dark:bg-dark-card
        transition-colors
        duration-300
      "
    >
      {/* Header */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Monitoring UMKM
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Pantau perkembangan UMKM di kecamatan Anda
            </p>
          </div>

          {/* Search */}
          <div className="relative w-80">
            <Search
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                -translate-y-1/2
                text-slate-400
                dark:text-slate-500
                transition-colors
                duration-300
              "
            />
            <input
              type="text"
              placeholder="Cari UMKM..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                h-11
                w-full
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-dark
                pl-11
                pr-4
                text-sm
                text-slate-700
                dark:text-white
                placeholder:text-slate-400
                dark:placeholder:text-slate-500
                outline-none
                transition-all
                duration-300
                hover:border-slate-300
                dark:hover:border-slate-700
                focus:border-sky-500
                focus:ring-4
                focus:ring-sky-500/10
              "
            />
          </div>
        </div>

        {/* Filters — below search, aligned right */}
        <div className="flex justify-end pt-4">
          <MonitoringFilters
            badge={badge}
            monitored={monitored}
            omzetMin={omzetMin}
            omzetMax={omzetMax}
            kecamatan={kecamatan}
            sort={sort}
            kecamatanOptions={kecamatanOptions}
            onBadgeChange={(v) => { setBadge(v); setPage(1); }}
            onMonitoredChange={(v) => { setMonitored(v); setPage(1); }}
            onOmzetMinChange={(v) => { setOmzetMin(v); setPage(1); }}
            onOmzetMaxChange={(v) => { setOmzetMax(v); setPage(1); }}
            onKecamatanChange={(v) => { setKecamatan(v); setPage(1); }}
            onSortChange={(v) => { setSort(v); setPage(1); }}
          />
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
