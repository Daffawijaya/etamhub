"use client";

import { Bell, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminNavbarProps {
  title?: string;
}

export default function AdminNavbar({ title = "Dashboard" }: AdminNavbarProps) {
  const pathname = usePathname();
  const isMapPage = pathname === "/admin/peta";

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  // Khusus halaman peta
  if (isMapPage) {
    return (
      <header className="absolute top-4 right-6 z-[1000]">
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white transition hover:bg-slate-50">
            <Bell size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="flex h-12 items-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </header>
    );
  }

  // Semua halaman admin lainnya (tidak berubah)
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white transition hover:bg-slate-50">
          <Bell size={18} />
        </button>

        <button
          onClick={handleLogout}
          className="flex h-12 items-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </header>
  );
}
