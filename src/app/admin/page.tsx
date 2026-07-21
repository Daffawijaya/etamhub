import CategoryPieChart from "@/components/admin/CategoryPieChart";
import DashboardHeader from "@/components/admin/DashboardHeader";
import KecamatanChart from "@/components/admin/KecamatanChart";
import StatsCards from "@/components/admin/StatsCards";
import UmkmMapWidget from "@/components/admin/UmkmMapWidget";
import LatestUmkm from "@/components/admin/LatestUmkm";
import QuickActions from "@/components/admin/QuickActions";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader />
        <QuickActions />
        <StatsCards />

        <UmkmMapWidget />

        <div className="grid gap-6 lg:grid-cols-2">
          <KecamatanChart />
          <CategoryPieChart />
        </div>

        <LatestUmkm />
      </div>
    </main>
  );
}
