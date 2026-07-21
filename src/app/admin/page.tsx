import CategoryPieChart from "@/components/admin/CategoryPieChart";
import DashboardHeader from "@/components/admin/DashboardHeader";
import KecamatanChart from "@/components/admin/KecamatanChart";
import StatsCards from "@/components/admin/StatsCards";
import UmkmMapWidget from "@/components/admin/UmkmMapWidget";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader />

        <StatsCards />

        <UmkmMapWidget />

        <div className="grid gap-6 lg:grid-cols-2">
          <KecamatanChart />
          <CategoryPieChart />
        </div>
      </div>
    </main>
  );
}
