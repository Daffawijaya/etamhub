"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldCheck, Megaphone, Palette, MonitorSmartphone, Activity } from "lucide-react";

interface MonitoringData {
  nama: string | null;
  deskripsi: string | null;
  gambar: string[] | null;
  npwp: string | null;
  nib: string | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  kbli: string[] | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

interface Props {
  umkmId: string;
}

interface CheckItem {
  label: string;
  detail: string;
  checked: boolean;
}

interface CheckCategory {
  icon: React.ReactNode;
  title: string;
  items: CheckItem[];
}

export default function Pendampingan({ umkmId }: Props) {
  const [latest, setLatest] = useState<MonitoringData | null>(null);
  const [totalMonitoring, setTotalMonitoring] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/umkm/${umkmId}/monitoring`)
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.latest ?? null);
        setTotalMonitoring(data.totalMonitoring ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [umkmId]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span className="text-sm">Memuat data pendampingan...</span>
        </div>
      </div>
    );
  }

  if (totalMonitoring === 0 || !latest) {
    return null;
  }

  // Build checklist categories from monitoring data
  const categories: CheckCategory[] = [
    {
      icon: <ShieldCheck size={18} className="text-emerald-600" />,
      title: "Legalitas Usaha",
      items: [
        {
          label: "NIB",
          detail: latest.nib || "Belum ada",
          checked: !!latest.nib,
        },
        {
          label: "NPWP",
          detail: latest.npwp || "Belum ada",
          checked: !!latest.npwp,
        },
        {
          label: "KBLI",
          detail: latest.kbli && latest.kbli.length > 0 ? latest.kbli.join(", ") : "Belum ada",
          checked: !!(latest.kbli && latest.kbli.length > 0),
        },
      ],
    },
    {
      icon: <Megaphone size={18} className="text-blue-600" />,
      title: "Digital Marketing",
      items: [
        {
          label: "Instagram",
          detail: latest.instagram || "Belum ada",
          checked: !!latest.instagram,
        },
        {
          label: "Facebook",
          detail: latest.facebook || "Belum ada",
          checked: !!latest.facebook,
        },
      ],
    },
    {
      icon: <Palette size={18} className="text-purple-600" />,
      title: "Branding",
      items: [
        {
          label: "Nama UMKM",
          detail: latest.nama || "Belum ada",
          checked: !!latest.nama,
        },
        {
          label: "Deskripsi",
          detail: latest.deskripsi ? "Sudah terisi" : "Belum ada",
          checked: !!latest.deskripsi,
        },
        {
          label: "Foto UMKM",
          detail: latest.gambar && latest.gambar.length > 0 ? `${latest.gambar.length} foto` : "Belum ada",
          checked: !!(latest.gambar && latest.gambar.length > 0),
        },
      ],
    },
    {
      icon: <MonitorSmartphone size={18} className="text-orange-600" />,
      title: "Digitalisasi",
      items: [
        {
          label: "Terdaftar di etamhub",
          detail: "Profil UMKM aktif di platform",
          checked: true,
        },
        {
          label: "Peta Lokasi",
          detail: "Lokasi bisnis terpampang di peta",
          checked: true,
        },
      ],
    },
  ];

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.checked).length,
    0,
  );
  const percentage = Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Pendampingan UMKM
        </h2>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {totalMonitoring}x kunjungan
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Progress Pendampingan
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-white">
            {checkedItems}/{totalItems} ({percentage}%)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const catChecked = category.items.filter((i) => i.checked).length;
          const catTotal = category.items.length;

          return (
            <div
              key={category.title}
              className="rounded-lg border border-slate-100 dark:border-slate-800"
            >
              {/* Category header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-t-lg">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    {category.title}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {catChecked}/{catTotal}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {category.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {item.checked ? (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <X size={12} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[160px]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
