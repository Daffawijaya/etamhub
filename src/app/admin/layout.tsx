"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getTitle = () => {
    if (pathname === "/admin") {
      return "Dashboard";
    }

    if (pathname === "/admin/umkm") {
      return "UMKM";
    }

    if (pathname === "/admin/tambah") {
      return "Tambah UMKM";
    }

    if (pathname.match(/^\/admin\/umkm\/[^/]+\/edit$/)) {
      return "Edit UMKM";
    }

    if (pathname.match(/^\/admin\/umkm\/[^/]/)) {
      return "Detail UMKM";
    }

    if (pathname === "/admin/berita") {
      return "Berita";
    }

    if (pathname.match(/^\/admin\/berita\/[^/]+\/edit$/)) {
      return "Berita";
    }

    if (pathname.match(/^\/admin\/berita\/[^/]/)) {
      return "Berita";
    }

    if (pathname === "/admin/berita/tambah") {
      return "Tambah Berita";
    }

    if (pathname === "/admin/requests") {
      return "Request";
    }

    if (pathname === "/admin/verifikasi") {
      return "Verifikasi UMKM";
    }

    if (pathname === "/admin/admin-kecamatan") {
      return "Akun";
    }

    if (pathname === "/admin/monitoring") {
      return "Monitoring UMKM";
    }

    if (pathname.match(/^\/admin\/monitoring\/[^/]/)) {
      return "Detail Monitoring";
    }

    if (pathname === "/admin/pengaturan-badge") {
      return "Pengaturan Badge";
    }

    if (pathname === "/admin/log-aktivitas") {
      return "Log Aktivitas";
    }

    return "Admin";
  };

  return (
    <main className="flex min-h-screen flex-col bg-light dark:bg-dark">
      {/* Desktop layout */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        <AdminSidebar />

        <div className="flex-1 min-w-0 bg-light dark:bg-dark">
          <DashboardNavbar title={getTitle()} />
          <div className="px-6 pb-8">{children}</div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="min-h-0 flex-1 lg:hidden">
        <AdminSidebar
          mobile
          open={sidebarOpen}
          onClose={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Content — pt-16 for navbar h-12 clearance, px-5 matches navbar px-5 */}
        <div className="pt-16 pb-8 px-5 bg-light dark:bg-dark">
          {children}
        </div>
      </div>
    </main>
  );
}
