"use client";

import Link from "next/link";
import { Plus, Map, Download, Upload } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Import Excel",
      icon: Upload,
      href: "/admin/import",
      color: "#1184CA",
    },
    {
      title: "Export Excel",
      icon: Download,
      href: "/admin/export",
      color: "#CA3785",
    },
    {
      title: "Lihat Peta",
      icon: Map,
      href: "/peta",
      color: "#844EC0",
    },
    {
      title: "Tambah UMKM",
      icon: Plus,
      href: "/admin/tambah",
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.title}
            href={action.href}
            className="
          group
          bg-white
          overflow-hidden
          rounded-2xl
          border
          border-black/5
          p-4
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-lg
          dark:border-white/10
        "
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${action.color}20`,
                color: action.color,
              }}
            >
              <Icon size={18} />
            </div>

            <p className="text-sm font-medium text-black dark:text-white">
              {action.title}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
