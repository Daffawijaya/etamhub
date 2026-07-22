"use client";

import { Bell, LogOut, Plus, Search } from "lucide-react";

interface AdminNavbarProps {
  title?: string;
}

export default function AdminNavbar({ title = "Dashboard" }: AdminNavbarProps) {
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between gap-6">
      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50">
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
