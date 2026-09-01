"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
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

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-3 w-3" />,
  silver: <SilverMedalIcon className="h-3 w-3" />,
  gold: <GoldMedalIcon className="h-3 w-3" />,
  platinum: <DiamondIcon className="h-3 w-3" />,
};

export default function MonitoringTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Tidak ada data monitoring ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div>
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`
            flex items-center gap-3 sm:gap-4
            px-4 sm:px-6
            py-3 sm:py-3.5
            transition-colors duration-300
            ${index !== data.length - 1 ? "border-b border-slate-100 dark:border-white/10" : ""}
          `}
        >
          {/* Image */}
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-xl">
            <Image
              src={getUmkmImage(item.gambar)}
              alt={item.nama}
              fill
              className="object-cover"
            />
          </div>

          {/* Name + info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm sm:text-[15px] text-slate-900 dark:text-white capitalize">
              {item.nama}
            </p>
            {/* Desktop: show pemilik + kecamatan */}
            <p className="hidden truncate text-xs text-slate-400 dark:text-slate-500 sm:block">
              {item.pemilik} · {item.kecamatan}
            </p>
            {/* Mobile: show kategori inline */}
            <span className={`mt-0.5 inline-flex sm:hidden rounded-md px-1.5 py-0.5 text-[10px] font-medium ${getCategoryStyle(item.kategori)}`}>
              {item.kategori}
            </span>
          </div>

          {/* Badge — always visible */}
          <div className="flex-shrink-0">
            {item.badge && item.badge.level !== "none" ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 sm:px-2.5 text-xs font-medium ${item.badge.bgColor} ${item.badge.color}`}
              >
                {BADGE_ICONS[item.badge.level]}
                <span className="hidden sm:inline">{item.badge.label}</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
            )}
          </div>

          {/* Kategori — desktop only */}
          <div className="hidden w-[100px] flex-shrink-0 sm:block">
            <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${getCategoryStyle(item.kategori)}`}>
              {item.kategori}
            </span>
          </div>

          {/* Monitoring count — desktop only */}
          <div className="hidden w-[80px] flex-shrink-0 text-right sm:block">
            {item.monitoringCount > 0 ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {item.monitoringCount}x
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">Belum</span>
            )}
          </div>

          {/* Omzet — desktop only */}
          <div className="hidden w-[130px] flex-shrink-0 text-right md:block">
            {item.latestMonitoring?.omzet ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {formatRupiah(item.latestMonitoring.omzet)}
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
            )}
          </div>

          {/* Action */}
          <Link
            href={`/admin/monitoring/${item.id}`}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 sm:h-9 sm:w-9"
          >
            <Eye size={14} />
          </Link>
        </div>
      ))}
    </div>
  );
}
