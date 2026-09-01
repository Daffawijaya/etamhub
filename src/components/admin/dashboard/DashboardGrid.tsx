"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

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
import { KECAMATAN_KUKAR } from "@/app/constants/kecamatanKukar";

export interface DashboardFilters {
  kecamatan: string;
  kategori: string;
  monitoring: string;
}

const DEFAULT_FILTERS: DashboardFilters = {
  kecamatan: "all",
  kategori: "all",
  monitoring: "all",
};

export default function DashboardGrid() {
  const [data, setData] = useState<any>(null);

  // Applied filters (used for actual data filtering)
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  // Draft filters (shown in UI, not applied until "Terapkan")
  const [draftFilters, setDraftFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const monitoring = data?.monitoring ?? {};

  const kecamatanList = useMemo(() => {
    return (data?.kecamatanChart ?? []).map((k: any) => k.name).sort();
  }, [data?.kecamatanChart]);

  const kategoriList = useMemo(() => {
    return (data?.kategoriChart ?? []).map((k: any) => k.name).sort();
  }, [data?.kategoriChart]);

  const monitoredIds = useMemo(() => {
    return new Set<string>(monitoring.monitoredIds ?? []);
  }, [monitoring.monitoredIds]);

  // ── Filter UMKM using APPLIED filters ──
  const filteredUmkm = useMemo(() => {
    let list = data?.map ?? [];

    if (appliedFilters.kecamatan !== "all") {
      list = list.filter((u: any) => u.kecamatan === appliedFilters.kecamatan);
    }
    if (appliedFilters.kategori !== "all") {
      list = list.filter((u: any) => u.kategori === appliedFilters.kategori);
    }
    if (appliedFilters.monitoring !== "all") {
      list = list.filter((u: any) =>
        appliedFilters.monitoring === "monitored"
          ? monitoredIds.has(u.id)
          : !monitoredIds.has(u.id)
      );
    }

    return list;
  }, [data?.map, appliedFilters, monitoredIds]);

  const filteredKategoriChart = useMemo(() => {
    if (appliedFilters.kecamatan === "all" && appliedFilters.monitoring === "all") {
      return data?.kategoriChart ?? [];
    }
    const map: Record<string, number> = {};
    for (const u of filteredUmkm) {
      const k = u.kategori || "Lainnya";
      map[k] = (map[k] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredUmkm, data?.kategoriChart, appliedFilters]);

  // ── Rebuild badge chart from filtered UMKM ──
  const filteredBadgeChart = useMemo(() => {
    if (appliedFilters.kecamatan === "all" && appliedFilters.kategori === "all" && appliedFilters.monitoring === "all") {
      return monitoring.badgeChart ?? [];
    }
    const umkmBadges = monitoring.umkmBadges ?? [];
    const filteredIds = new Set(filteredUmkm.map((u: any) => u.id));
    const badgeCounts: Record<string, number> = { none: 0, bronze: 0, silver: 0, gold: 0, platinum: 0 };
    for (const ub of umkmBadges) {
      if (filteredIds.has(ub.id)) {
        badgeCounts[ub.level] = (badgeCounts[ub.level] || 0) + 1;
      }
    }
    return [
      { name: "Belum Dimonitoring", value: badgeCounts.none, color: "#E8E8EE" },
      { name: "Pemula", value: badgeCounts.bronze, color: "#10B981" },
      { name: "Tumbuh", value: badgeCounts.silver, color: "#94A3B8" },
      { name: "Berkembang", value: badgeCounts.gold, color: "#F59E0B" },
      { name: "Naik Kelas", value: badgeCounts.platinum, color: "#7C3AED" },
    ];
  }, [filteredUmkm, monitoring.badgeChart, monitoring.umkmBadges, appliedFilters]);

  const filteredStats = useMemo(() => {
    if (appliedFilters.kecamatan === "all" && appliedFilters.kategori === "all" && appliedFilters.monitoring === "all") {
      return data?.stats ?? { totalUmkm: 0, totalKecamatan: 0, totalSubkategori: 0, digitalCount: 0, legalitasCount: 0, digitalPercent: 0, legalitasPercent: 0 };
    }
    const totalUmkm = filteredUmkm.length;
    const subkategoriSet = new Set(filteredUmkm.map((u: any) => u.subkategori).filter(Boolean));
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
  }, [data?.stats, filteredUmkm, appliedFilters]);

  // Count active APPLIED filters for badge
  const activeCount =
    (appliedFilters.kecamatan !== "all" ? 1 : 0) +
    (appliedFilters.kategori !== "all" ? 1 : 0) +
    (appliedFilters.monitoring !== "all" ? 1 : 0);

  // Apply: copy draft → applied
  const handleApply = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters]);

  // Reset: clear both draft and applied
  const handleReset = useCallback(() => {
    setDraftFilters({ ...DEFAULT_FILTERS });
    setAppliedFilters({ ...DEFAULT_FILTERS });
  }, []);

  if (!data) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatsCards stats={filteredStats} />
          <CategoryPieChart data={filteredKategoriChart} />
        </div>

        <OmzetTrendChart data={monitoring.omzetTrend ?? []} />
        <LatestUmkm umkms={filteredUmkm.slice(0, 5)} />
        <UmkmMapWidget umkms={filteredUmkm} />
      </div>

      <div className="space-y-6 lg:col-span-4">
        <div className="flex items-center justify-between overflow-visible">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredStats.totalUmkm} dari {(data?.map ?? []).length} UMKM
          </span>
          <div className="relative overflow-visible">
          <FilterSheet
            activeCount={activeCount}
            onReset={handleReset}
            onApply={handleApply}
            discardOnClose
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Kecamatan</label>
              <CustomSelect
                value={draftFilters.kecamatan}
                onChange={(v) => setDraftFilters((f) => ({ ...f, kecamatan: v }))}
                placeholder="Semua Kecamatan"
                options={[
                  { value: "all", label: "Semua Kecamatan" },
                  ...kecamatanList.map((k: string) => ({ value: k, label: k })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Kategori</label>
              <CustomSelect
                value={draftFilters.kategori}
                onChange={(v) => setDraftFilters((f) => ({ ...f, kategori: v }))}
                placeholder="Semua Kategori"
                options={[
                  { value: "all", label: "Semua Kategori" },
                  ...kategoriList.map((k: string) => ({ value: k, label: k })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Status Monitoring</label>
              <CustomSelect
                value={draftFilters.monitoring}
                onChange={(v) => setDraftFilters((f) => ({ ...f, monitoring: v }))}
                placeholder="Semua Status"
                options={[
                  { value: "all", label: "Semua Status" },
                  { value: "monitored", label: "Sudah Dimonitoring" },
                ]}
              />
            </div>
          </FilterSheet>
          </div>
        </div>

        <BadgePieChart data={filteredBadgeChart} monitoredCount={monitoring.monitoredCount ?? 0} totalUmkm={filteredStats.totalUmkm ?? 0} />
        <UmkmProgressStats digitalCount={filteredStats.digitalCount ?? 0} digitalPercent={filteredStats.digitalPercent ?? 0} legalitasCount={filteredStats.legalitasCount ?? 0} legalitasPercent={filteredStats.legalitasPercent ?? 0} totalUmkm={filteredStats.totalUmkm ?? 0} />
        <KecamatanChart data={data.kecamatanChart ?? []} allNames={[...KECAMATAN_KUKAR]} />
      </div>
    </div>
  );
}
