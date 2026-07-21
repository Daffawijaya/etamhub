import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardGrid from "@/components/admin/DashboardGrid";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
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
