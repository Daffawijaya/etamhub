"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Award } from "lucide-react";
import { getUmkmImage } from "@/lib/getUmkmImage";

interface MonitoringItem {
  id: string;
  nama: string;
  pemilik: string | null;
  kategori: string;
  kecamatan: string;
  gambar: string[];
  latestMonitoring: {
    id: string;
    created_at: string;
    omzet: number | null;
    jumlah_tenaga_kerja: number | null;
  } | null;
  monitoringCount: number;
  badge: {
    level: string;
    label: string;
    color: string;
    bgColor: string;
    description: string;
  };
}

interface Props {
  data: MonitoringItem[];
}

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const getCategoryStyle = (kategori: string) => {
  switch (kategori) {
    case "Perdagangan":
      return "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300";
    case "Jasa":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300";
    case "Industri":
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
  }
};

export default function MonitoringTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Tidak ada data monitoring ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10">
            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">
              UMKM
            </th>
            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">
              Kategori
            </th>
            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">
              Kecamatan
            </th>
            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">
              Badge
            </th>
            <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
              Monitoring
            </th>
            <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
              Omzet Terakhir
            </th>
            <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {data.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
            >
              {/* UMKM */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={getUmkmImage(item.gambar)}
                      alt={item.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-white capitalize">
                      {item.nama}
                    </p>
                    {item.pemilik && (
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {item.pemilik}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Kategori */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getCategoryStyle(item.kategori)}`}>
                  {item.kategori}
                </span>
              </td>

              {/* Kecamatan */}
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                {item.kecamatan}
              </td>

              {/* Badge */}
              <td className="px-6 py-4">
                {item.badge && item.badge.level !== "none" ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${item.badge.bgColor} ${item.badge.color}`}
                  >
                    <Award size={12} />
                    {item.badge.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    -
                  </span>
                )}
              </td>

              {/* Monitoring count */}
              <td className="px-6 py-4 text-right">
                {item.monitoringCount > 0 ? (
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {item.monitoringCount}x
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Belum
                  </span>
                )}
              </td>

              {/* Omzet */}
              <td className="px-6 py-4 text-right">
                {item.latestMonitoring?.omzet ? (
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatRupiah(item.latestMonitoring.omzet)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    -
                  </span>
                )}
              </td>

              {/* Action */}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/monitoring/${item.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                >
                  <Eye size={15} />
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
