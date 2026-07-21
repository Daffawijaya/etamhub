"use client";

import { Bell, Plus, Search, Settings } from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="flex items-center justify-between gap-6">
      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola data UMKM Kutai Kartanegara
        </p>
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
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Bell size={18} />
        </button>

        {/* Settings */}
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Settings size={18} />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
            D
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">EtamHub</p>
          </div>
        </button>
      </div>
    </header>
  );
}
