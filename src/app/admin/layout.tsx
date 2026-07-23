"use client";

import { usePathname } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

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

    return "Admin";
  };

  return (
    <main className="min-h-screen bg-light-bg">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <AdminNavbar title={getTitle()} />

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
