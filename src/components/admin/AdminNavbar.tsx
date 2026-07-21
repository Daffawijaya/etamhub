"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Plus, Search } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    // hapus token/session jika ada
    localStorage.removeItem("token");

    // arahkan ke halaman login
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between gap-6">
      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari UMKM..."
            className="h-12 w-72 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Add Button */}
        <button className="flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800">
          <Plus size={18} />
          Tambah UMKM
        </button>

        {/* Notification */}
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50">
          <Bell size={18} />
        </button>

        {/* Logout */}
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
