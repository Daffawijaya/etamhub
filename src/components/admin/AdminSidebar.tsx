"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  MapPinned,
  ChartColumn,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

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
    label: "Peta",
    icon: MapPinned,
    href: "/admin/map",
  },
  {
    label: "Kecamatan",
    icon: Building2,
    href: "/admin/kecamatan",
  },
  {
    label: "Statistik",
    icon: ChartColumn,
    href: "/admin/statistik",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#1184CA] to-[#844EC0] text-lg font-bold text-white">
            E
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              EtamHub
            </h2>
            <p className="text-xs text-slate-500">
              Admin Dashboard
            </p>
          </div>
        </div>
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
                <span className="font-medium">
                  {menu.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-4">
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-100">
            <Settings size={20} />
            Pengaturan
          </button>

          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 transition hover:bg-red-50">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}