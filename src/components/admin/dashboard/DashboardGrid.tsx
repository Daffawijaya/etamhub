"use client";

import { useEffect, useMemo, useState } from "react";

import CustomSelect from "@/components/ui/CustomSelect";
import FilterSheet from "@/components/ui/FilterSheet";

import AdminDashboardSkeleton from "./DashboardSkeleton";
import BadgePieChart from "./BadgePieChart";
import CategoryPieChart from "./CategoryPieChart";
import KecamatanChart from "./KecamatanChart";
import LatestUmkm from "./LatestUmkm";
import OmzetTrendChart from "./OmzetTrendChart";
import StatsCards from "./StatsCards";
import UmkmMapWidget from "./UmkmMapWidget";
import UmkmProgressStats from "./UmkmProgressStats";

export default function DashboardGrid() {
  const [data, setData] = useState<any>(null);
  const [filterKecamatan, setFilterKecamatan] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");
  const [filterMonitoring, setFilterMonitoring] = useState("all");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const monitoring = data?.monitoring ?? {};

  // ── Build unique option lists from raw data ──
  const kecamatanList = useMemo(() => {
    return (data?.kecamatanChart ?? [])
      .map((k: any) => k.name)
      .sort();
  }, [data?.kecamatanChart]);

  const kategoriList = useMemo(() => {
    return (data?.kategoriChart ?? [])
      .map((k: any) => k.name)
      .sort();
  }, [data?.kategoriChart]);

  // ── Client-side filter on raw UMKM list ──
  const filteredUmkm = useMemo(() => {
    let list = data?.map ?? [];

    if (filterKecamatan !== "all") {
      list = list.filter((u: any) => u.kecamatan === filterKecamatan);
    }

    if (filterKategori !== "all") {
      list = list.filter((u: any) => u.kategori === filterKategori);
    }

    return list;
  }, [data?.map, filterKecamatan, filterKategori, filterMonitoring]);

  // ── Rebuild kategori chart from filtered UMKM ──
  const filteredKategoriChart = useMemo(() => {
    if (filterKecamatan === "all" && filterMonitoring === "all") {
      return data?.kategoriChart ?? [];
    }
    const map: Record<string, number> = {};
    for (const u of filteredUmkm) {
      const k = u.kategori || "Lainnya";
      map[k] = (map[k] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredUmkm, data?.kategoriChart, filterKecamatan, filterMonitoring]);

  // ── Stats from filtered data ──
  const filteredStats = useMemo(() => {
    if (filterKecamatan === "all" && filterKategori === "all" && filterMonitoring === "all") {
      return data?.stats ?? { totalUmkm: 0, totalKecamatan: 0, totalSubkategori: 0, digitalCount: 0, legalitasCount: 0, digitalPercent: 0, legalitasPercent: 0 };
    }
    const totalUmkm = filteredUmkm.length;
    const subkategoriSet = new Set(
      filteredUmkm.map((u: any) => u.subkategori).filter(Boolean),
    );
    let digitalCount = 0;
    let legalitasCount = 0;
    for (const u of filteredUmkm) {
      if (u.instagram || u.facebook || u.tiktok) digitalCount++;
      if (u.halal || u.pirt || u.haki || u.nib) legalitasCount++;
    }
    const uniqueKecamatan = new Set(filteredUmkm.map((u: any) => u.kecamatan).filter(Boolean));
    return {
      ...(data?.stats ?? {}),
      totalUmkm,
      totalKecamatan: uniqueKecamatan.size,
      totalSubkategori: subkategoriSet.size,
      digitalCount,
      legalitasCount,
      digitalPercent: totalUmkm > 0 ? Math.round((digitalCount / totalUmkm) * 100) : 0,
      legalitasPercent: totalUmkm > 0 ? Math.round((legalitasCount / totalUmkm) * 100) : 0,
    };
  }, [data?.stats, filteredUmkm, filterKecamatan, filterKategori, filterMonitoring]);

  const activeCount =
    (filterKecamatan !== "all" ? 1 : 0) +
    (filterKategori !== "all" ? 1 : 0) +
    (filterMonitoring !== "all" ? 1 : 0);

  const hasFilters = activeCount > 0;

  function handleResetFilters() {
    setFilterKecamatan("all");
    setFilterKategori("all");
    setFilterMonitoring("all");
  }

  if (!data) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        {/* Top row: StatsCards + CategoryPieChart */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatsCards stats={filteredStats} />
          <CategoryPieChart data={filteredKategoriChart} />
        </div>

        {/* Omzet Trend Chart */}
        <OmzetTrendChart data={monitoring.omzetTrend ?? []} />

        {/* Latest UMKM */}
        <LatestUmkm umkms={filteredUmkm.slice(0, 5)} />

        {/* Map */}
        <UmkmMapWidget umkms={filteredUmkm} />
      </div>

      <div className="space-y-6 lg:col-span-4">
        {/* Dashboard Filter — same style as monitoring page */}
        <div className="relative">
          <FilterSheet
            activeCount={activeCount}
            onReset={handleResetFilters}
            onApply={() => {}}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Kecamatan
              </label>
              <CustomSelect
                value={filterKecamatan}
                onChange={setFilterKecamatan}
                placeholder="Semua Kecamatan"
                options={[
                  { value: "all", label: "Semua Kecamatan" },
                  ...kecamatanList.map((k: string) => ({ value: k, label: k })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Kategori
              </label>
              <CustomSelect
                value={filterKategori}
                onChange={setFilterKategori}
                placeholder="Semua Kategori"
                options={[
                  { value: "all", label: "Semua Kategori" },
                  ...kategoriList.map((k: string) => ({ value: k, label: k })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Status Monitoring
              </label>
              <CustomSelect
                value={filterMonitoring}
                onChange={setFilterMonitoring}
                placeholder="Semua Status"
                options={[
                  { value: "all", label: "Semua Status" },
                  { value: "monitored", label: "Sudah Dimonitoring" },
                  { value: "unmonitored", label: "Belum Dimonitoring" },
                ]}
              />
            </div>
          </FilterSheet>
        </div>

        {/* Badge Distribution Pie Chart */}
        <BadgePieChart
          data={monitoring.badgeChart ?? []}
          monitoredCount={monitoring.monitoredCount ?? 0}
          totalUmkm={filteredStats.totalUmkm ?? 0}
        />

        {/* Umkm Progress: Digitalisasi & Legalitas */}
        <UmkmProgressStats
          digitalCount={filteredStats.digitalCount ?? 0}
          digitalPercent={filteredStats.digitalPercent ?? 0}
          legalitasCount={filteredStats.legalitasCount ?? 0}
          legalitasPercent={filteredStats.legalitasPercent ?? 0}
          totalUmkm={filteredStats.totalUmkm ?? 0}
        />

        {/* Top Kecamatan — always shows ALL data, not affected by filters */}
        <KecamatanChart data={data.kecamatanChart ?? []} />
      </div>
    </div>
  );
}
