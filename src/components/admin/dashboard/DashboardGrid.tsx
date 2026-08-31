"use client";

import { useEffect, useState } from "react";

import ActivityLogs from "./ActivityLogs";
import AdminDashboardSkeleton from "./DashboardSkeleton";
import BadgePieChart from "./BadgePieChart";
import CategoryPieChart from "./CategoryPieChart";
import KecamatanChart from "./KecamatanChart";
import LatestUmkm from "./LatestUmkm";
import OmzetTrendChart from "./OmzetTrendChart";
import QuickActions from "./QuickActions";
import StatsCards from "./StatsCards";
import UmkmMapWidget from "./UmkmMapWidget";
import UmkmProgressStats from "./UmkmProgressStats";

export default function DashboardGrid() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return <AdminDashboardSkeleton />;
  }

  const monitoring = data.monitoring ?? {};

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        {/* Top row: Stats + Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatsCards stats={data.stats} />
          <QuickActions />
        </div>

        {/* Omzet Trend Chart */}
        <OmzetTrendChart data={monitoring.omzetTrend ?? []} />

        {/* Latest UMKM */}
        <LatestUmkm umkms={data.latest} />

        {/* Map */}
        <UmkmMapWidget umkms={data.map ?? []} />
      </div>

      <div className="space-y-6 lg:col-span-4">
        {/* Badge Distribution Pie Chart */}
        <BadgePieChart
          data={monitoring.badgeChart ?? []}
          monitoredCount={monitoring.monitoredCount ?? 0}
          totalUmkm={data.stats?.totalUmkm ?? 0}
        />

        {/* Umkm Progress: Digitalisasi & Legalitas */}
        <UmkmProgressStats
          digitalCount={data.stats?.digitalCount ?? 0}
          digitalPercent={data.stats?.digitalPercent ?? 0}
          legalitasCount={data.stats?.legalitasCount ?? 0}
          legalitasPercent={data.stats?.legalitasPercent ?? 0}
          totalUmkm={data.stats?.totalUmkm ?? 0}
        />

        <CategoryPieChart data={data.kategoriChart} />

        <KecamatanChart data={data.kecamatanChart} />

        <ActivityLogs activities={data.activities} />
      </div>
    </div>
  );
}
