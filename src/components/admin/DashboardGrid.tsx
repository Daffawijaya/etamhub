import { supabase } from "@/lib/supabase";

import ActivityLogs from "./ActivityLogs";
import CategoryPieChart from "./CategoryPieChart";
import KecamatanChart from "./KecamatanChart";
import LatestUmkm from "./LatestUmkm";
import QuickActions from "./QuickActions";
import StatsCards from "./StatsCards";
import UmkmMapWidget from "./UmkmMapWidget";

export default async function DashboardGrid() {
  const { data: umkms, error } = await supabase.from("umkm").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT COLUMN */}
      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <StatsCards umkms={umkms ?? []} />

          <QuickActions />
        </div>

        <LatestUmkm umkms={umkms ?? []} />

        <UmkmMapWidget umkms={umkms ?? []} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-4 space-y-6">
        <CategoryPieChart umkms={umkms ?? []} />

        <KecamatanChart umkms={umkms ?? []} />

        <ActivityLogs />
      </div>
    </div>
  );
}
