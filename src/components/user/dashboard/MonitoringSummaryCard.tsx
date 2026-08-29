"use client";

import {
  TrendingUp,
  Users,
  Shield,
  Share2,
  Calendar,
} from "lucide-react";

type MonitoringData = {
  omzet: number | null;
  jumlah_tenaga_kerja: number | null;
  nib: string | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
} | null;

type Props = {
  monitoring: {
    count: number;
    lastDate: string | null;
    latestData: MonitoringData;
  };
  umkm: {
    nama: string;
  } | null;
};

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countLegalitas(d: MonitoringData) {
  if (!d) return 0;
  let c = 0;
  if (d.nib) c++;
  if (d.halal) c++;
  if (d.pirt) c++;
  if (d.haki) c++;
  return c;
}

function countSosmed(d: MonitoringData) {
  if (!d) return 0;
  let c = 0;
  if (d.instagram) c++;
  if (d.facebook) c++;
  if (d.tiktok) c++;
  return c;
}

export default function MonitoringSummaryCard({ monitoring, umkm }: Props) {
  const { count, lastDate, latestData } = monitoring;
  const legalitasCount = countLegalitas(latestData);
  const sosmedCount = countSosmed(latestData);

  if (count === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-white/5">
            <Calendar size={18} className="text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Monitoring
            </h3>
            <p className="text-xs text-slate-400">Belum ada data monitoring</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-white/[0.02] p-4 text-center">
          <p className="text-sm text-slate-400">
            UMKM {umkm?.nama ?? "-"} belum pernah dimonitoring oleh admin.
          </p>
        </div>
      </div>
    );
  }

  const topics: { icon: typeof TrendingUp; label: string; detail: string; color: string }[] = [];

  if (latestData?.omzet != null) {
    topics.push({
      icon: TrendingUp,
      label: "Manajemen Keuangan",
      detail: `Omzet ${formatRupiah(latestData.omzet)}`,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
    });
  }

  if (latestData?.jumlah_tenaga_kerja != null) {
    topics.push({
      icon: Users,
      label: "Pengelolaan SDM",
      detail: `${latestData.jumlah_tenaga_kerja} Tenaga Kerja`,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
    });
  }

  if (legalitasCount > 0) {
    const items = [
      latestData?.nib && "NIB",
      latestData?.halal && "Halal",
      latestData?.pirt && "PIRT",
      latestData?.haki && "HAKI",
    ]
      .filter(Boolean)
      .join(", ");
    topics.push({
      icon: Shield,
      label: "Legalitas",
      detail: items,
      color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20",
    });
  }

  if (sosmedCount > 0) {
    const items = [
      latestData?.instagram && "Instagram",
      latestData?.facebook && "Facebook",
      latestData?.tiktok && "TikTok",
    ]
      .filter(Boolean)
      .join(", ");
    topics.push({
      icon: Share2,
      label: "Digitalisasi",
      detail: items,
      color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20",
    });
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5">
            <Calendar size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Monitoring
            </h3>
            <p className="text-xs text-slate-400">
              {count} kali monitoring · Terakhir: {formatDate(lastDate)}
            </p>
          </div>
        </div>
      </div>

      {topics.length > 0 ? (
        <div className="space-y-2.5">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.02]"
              >
                <div className={`rounded-lg p-2 ${topic.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {topic.label}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{topic.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 dark:bg-white/[0.02] p-4 text-center">
          <p className="text-sm text-slate-400">Belum ada data pendampingan</p>
        </div>
      )}
    </div>
  );
}
