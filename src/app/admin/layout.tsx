"use client";

import { usePathname } from "next/navigation";

import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      return "Admin Kecamatan";
    }

    return "Admin";
  };

  return (
    <main className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-light dark:bg-dark">
        <DashboardNavbar title={getTitle()} />

        <div>{children}</div>
      </div>
    </main>
  );
}
