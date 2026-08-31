"use client";

import { Building2, ClipboardCheck, Clock3, Globe2, Award } from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import type { ReactNode } from "react";

const BADGE_SVG: Record<string, ReactNode> = {
  bronze: <SeedlingIcon className="h-4 w-4" />,
  silver: <SilverMedalIcon className="h-4 w-4" />,
  gold: <GoldMedalIcon className="h-4 w-4" />,
  platinum: <DiamondIcon className="h-4 w-4" />,
};

const BADGE_DOT: Record<string, string> = {
  bronze: "bg-amber-400",
  silver: "bg-emerald-400",
  gold: "bg-orange-400",
  platinum: "bg-violet-400",
};

const BADGE_BORDER: Record<string, string> = {
  bronze: "border-amber-400/60",
  silver: "border-emerald-400/60",
  gold: "border-orange-400/60",
  platinum: "border-violet-400/60",
};

type Props = {
  data: {
    umkm: {
      nama: string;
    } | null;

    status: {
      approval_label: string;
      published: boolean;
      hasPendingEdit?: boolean;
    };

    completeness: {
      percentage: number;
      filled: number;
      total: number;
    };

    badge: {
      level: string;
      label: string;
      color: string;
      bgColor: string;
      description: string;
    };

    monitoring: {
      count: number;
      lastDate: string | null;
    };
  };
};

export default function SummaryCards({ data }: Props) {
  const badgeInfo = data.badge;
  const monitoringInfo = data.monitoring;

  const stats = [
    {
      title: "UMKM Saya",
      value: data.umkm?.nama ?? "-",
      description: data.umkm ? "Usaha sudah terdaftar" : "Belum memiliki UMKM",
      icon: Building2,
    },
    {
      title: "Status Pengajuan",
      value: data.status.hasPendingEdit ? "Edit Diverifikasi" : data.status.approval_label,
      description: data.status.hasPendingEdit ? "Perubahan data sedang diverifikasi" : "Status pengajuan UMKM",
      icon: Clock3,
    },
    {
      title: "Publikasi",
      value: data.status.published ? "Sudah Tampil" : "Belum Tampil",
      description: data.status.published
        ? "UMKM sudah tampil pada katalog"
        : "Menunggu persetujuan admin",
      icon: Globe2,
    },
    {
      title: "Kelengkapan Data",
      value: `${data.completeness.percentage}%`,
      description: `${data.completeness.filled}/${data.completeness.total} data terisi`,
      icon: ClipboardCheck,
    },
  ];

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl px-5 py-4 text-white
        sm:p-6
        md:p-8
        bg-gradient-to-br
        from-[#ff7a59]
        via-[#ff6b7d]
        to-[#ff4fa3]
        dark:from-[#1b1027]
        dark:via-[#21152f]
        dark:to-[#130f1d]
        transition-all
        duration-500
        ease-in-out
      "
    >
      {/* Decorative blurs */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#ff4fa3]/20" />
      <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#1184CA]/20" />

      <div className="relative">
        {/* Hero stat */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md dark:bg-white/10">
            <Building2 size={24} />
          </div>
          <div className="text-center sm:text-right">
            <p className="text-white/70">UMKM Saya</p>
            <h2 className="text-2xl font-bold leading-none sm:text-4xl">
              {data.umkm?.nama ?? "-"}
            </h2>
            <p className="mt-1 text-white/70">
              {data.umkm ? "Usaha sudah terdaftar" : "Belum memiliki UMKM"}
            </p>
          </div>
        </div>

        {/* Badge + Monitoring row */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {badgeInfo.level !== "none" ? (
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/15 px-3 py-1.5 backdrop-blur-sm border-white/20">
              {BADGE_SVG[badgeInfo.level]}
              <span className="text-sm font-semibold">{badgeInfo.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-white/40" />
              <p className="text-sm text-white/50">Belum ada badge</p>
            </div>
          )}
          {monitoringInfo.count > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-semibold">
                {monitoringInfo.count}x Monitoring
              </p>
              {monitoringInfo.lastDate && (
                <p className="text-[10px] text-white/60">
                  · {new Date(monitoringInfo.lastDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sub stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
          {stats.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm dark:bg-white/5 dark:border dark:border-white/10"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={16} />
                  <span className="text-sm text-white/80">{item.title}</span>
                </div>
                <p className="text-lg font-bold">{item.value}</p>
                <p className="mt-1 text-xs text-white/60">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
