import ActivityLogs from "./ActivityLogs";
import CategoryPieChart from "./CategoryPieChart";
import KecamatanChart from "./KecamatanChart";
import LatestUmkm from "./LatestUmkm";
import QuickActions from "./QuickActions";
import StatsCards from "./StatsCards";
import UmkmMapWidget from "./UmkmMapWidget";

export default function DashboardGrid() {
  return (
    <div className="mt-8 grid grid-cols-12 gap-6">
      {/* LEFT COLUMN */}
      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <StatsCards />
          <CategoryPieChart />
        </div>

        <LatestUmkm />

        <UmkmMapWidget />
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-4 space-y-6">
        <QuickActions />

        <KecamatanChart />

        <ActivityLogs />
      </div>
    </div>
  );
}
