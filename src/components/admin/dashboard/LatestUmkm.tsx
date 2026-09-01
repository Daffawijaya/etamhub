"use client";

import Image from "next/image";
import Link from "next/link";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import { getUmkmImage } from "@/lib/getUmkmImage";
import type { Umkm } from "@/data/umkm";

interface BadgeInfo {
  id: string;
  level: string;
}

interface Props {
  umkms: Umkm[];
  umkmBadges?: BadgeInfo[];
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-3.5 w-3.5" />,
  silver: <SilverMedalIcon className="h-3.5 w-3.5" />,
  gold: <GoldMedalIcon className="h-3.5 w-3.5" />,
  platinum: <DiamondIcon className="h-3.5 w-3.5" />,
};

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  none: { bg: "bg-[#E8E8EE] dark:bg-[#3A3A4A]", text: "text-slate-400", label: "Belum Ada" },
  bronze: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", label: "Pemula" },
  silver: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", label: "Tumbuh" },
  gold: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", label: "Berkembang" },
  platinum: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", label: "Naik Kelas" },
};

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LatestUmkm({ umkms, umkmBadges = [] }: Props) {
  const badgeMap = new Map(umkmBadges.map((b) => [b.id, b.level]));

  const latest = [...umkms]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card transition-colors duration-300">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
          UMKM Terbaru
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
          5 UMKM yang terakhir ditambahkan
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {latest.map((item) => {
          const level = badgeMap.get(item.id) ?? "none";
          const badge = BADGE_STYLES[level] ?? BADGE_STYLES.none;

          return (
            <Link
              key={item.id}
              href={`/admin/umkm/${item.id}`}
              className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
            >
              {/* Image */}
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                <Image
                  src={getUmkmImage(item.gambar)}
                  alt={item.nama}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              {/* Name + kecamatan */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {item.nama}
                </h4>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                  {item.kecamatan} · {formatDate(item.created_at)}
                </p>
              </div>

              {/* Badge */}
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}
              >
                {BADGE_ICONS[level]}
                {badge.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
