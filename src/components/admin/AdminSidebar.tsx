"use client";

import Link from "next/link";
import { LayoutDashboard, Store, MapPinned, Plus } from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "UMKM",
    icon: Store,
    href: "/admin/umkm",
  },
  {
    label: "Tambah UMKM",
    icon: Plus,
    href: "/admin/tambah",
  },
  {
    label: "Peta",
    icon: MapPinned,
    href: "/admin/map",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-70 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          etamhub
        </h2>

        <p className="mt-1 text-xs text-slate-500">Admin Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <Link
                key={menu.label}
                href={menu.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon size={20} />

                <span className="font-medium">{menu.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
