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
      {/* Row 1 */}
      <div className="col-span-4">
        <StatsCards />
      </div>

      <div className="col-span-4">
        <CategoryPieChart />
      </div>

      <div className="col-span-4">
        <QuickActions />
      </div>

      {/* Row 2 */}
      <div className="col-span-8">
        <LatestUmkm />
      </div>

      <div className="col-span-4">
        <KecamatanChart />
      </div>

      {/* Row 3 */}
      <div className="col-span-8">
        <UmkmMapWidget />
      </div>

      <div className="col-span-4">
        <ActivityLogs />
      </div>
    </div>
  );
}