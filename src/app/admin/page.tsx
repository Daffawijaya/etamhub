import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardGrid from "@/components/admin/DashboardGrid";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-light-bg">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <AdminNavbar />
          <DashboardGrid />
        </div>
      </div>
    </main>
  );
}
