"use client";

import { useEffect, useState } from "react";

import ActivityLogs from "./ActivityLogs";
import CategoryPieChart from "./CategoryPieChart";
import KecamatanChart from "./KecamatanChart";
import LatestUmkm from "./LatestUmkm";
import QuickActions from "./QuickActions";
import StatsCards from "./StatsCards";
import UmkmMapWidget from "./UmkmMapWidget";

export default function DashboardGrid() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <StatsCards stats={data.stats} />

          <QuickActions />
        </div>

        <LatestUmkm umkms={data.latest} />

        <UmkmMapWidget umkms={data.map ?? []} />
      </div>

      <div className="col-span-4 space-y-6">
        <CategoryPieChart data={data.kategoriChart} />

        <KecamatanChart data={data.kecamatanChart} />

        <ActivityLogs activities={data.activities} />
      </div>
    </div>
  );
}
