"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface MonitoringEntry {
  id: string;
  created_at: string;
  jumlah_tenaga_kerja: number | null;
  omzet: number | null;
  nib: string | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  kbli: string[] | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  kebutuhan_utama: string | null;
  catatan: string | null;
}

interface MonitoringResponse {
  initial: Record<string, any>;
  latest: Record<string, any>;
  monitorings: MonitoringEntry[];
  totalMonitoring: number;
}

type Props = {
  umkmId: string;
};

export default function UmkmPendampinganTab({ umkmId }: Props) {
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/umkm/${umkmId}/monitoring`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [umkmId]);

  if (loading) {
    return (
      <div className="flex h-[34.5vh] items-center justify-center rounded-2xl bg-light-bg dark:bg-white/[0.03]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Memuat data pendampingan...
        </p>
      </div>
    );
  }

  if (!data || data.totalMonitoring === 0) {
    return (
      <div className="flex h-[34.5vh] items-center justify-center rounded-2xl bg-light-bg text-center dark:bg-white/[0.03]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          UMKM ini belum memiliki data pendampingan.
        </p>
      </div>
    );
  }

  const { initial, latest, monitorings } = data;

  // Check what data was added/changed during monitoring
  const hasOmzet = monitorings.some((m) => m.omzet != null);
  const hasSosmed = monitorings.some(
    (m) => m.instagram != null || m.facebook != null || m.tiktok != null,
  );
  const hasLegalitas = monitorings.some(
    (m) => m.nib != null || m.halal != null || m.pirt != null || m.haki != null || (m.kbli && m.kbli.length > 0),
  );
  const hasTK = monitorings.some((m) => m.jumlah_tenaga_kerja != null);

  // Build pendampingan items based on monitoring data
  const pendampingan: { label: string; items: string[] }[] = [];

  // Manajemen Keuangan - if monitoring has omzet data
  if (hasOmzet && latest.omzet != null) {
    pendampingan.push({
      label: "Manajemen Keuangan",
      items: ["Omzet", latest.jumlah_tenaga_kerja ? `${latest.jumlah_tenaga_kerja} Tenaga Kerja` : ""].filter(Boolean),
    });
  }

  // Legalitas - if monitoring has legalitas data
  if (hasLegalitas) {
    const legalItems = [
      latest.nib && `NIB: ${latest.nib}`,
      (latest.kbli?.length ?? 0) > 0 && `KBLI: ${latest.kbli!.join(", ")}`,
      latest.halal && `Halal: ${latest.halal}`,
      latest.pirt && `PIRT: ${latest.pirt}`,
      latest.haki && `HAKI: ${latest.haki}`,
    ].filter(Boolean) as string[];
    if (legalItems.length > 0) {
      pendampingan.push({ label: "Legalitas", items: legalItems });
    }
  }

  // Digitalisasi - if monitoring has sosmed data
  if (hasSosmed) {
    const sosmedItems = [
      latest.instagram && `Instagram: ${latest.instagram}`,
      latest.facebook && `Facebook: ${latest.facebook}`,
      latest.tiktok && `TikTok: ${latest.tiktok}`,
    ].filter(Boolean) as string[];
    if (sosmedItems.length > 0) {
      pendampingan.push({ label: "Digitalisasi", items: sosmedItems });
    }
  }

  // Tenaga Kerja - if monitoring has TK data
  if (hasTK && latest.jumlah_tenaga_kerja != null) {
    pendampingan.push({
      label: "Pengelolaan SDM",
      items: [`${latest.jumlah_tenaga_kerja} Tenaga Kerja`],
    });
  }

  if (pendampingan.length === 0) {
    return (
      <div className="flex h-[34.5vh] items-center justify-center rounded-2xl bg-light-bg text-center dark:bg-white/[0.03]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada data pendampingan dari monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Berdasarkan {data.totalMonitoring}x monitoring admin kecamatan
        </span>
      </div>
      <ul>
        {pendampingan.map((item) => (
          <li key={item.label} className="py-3">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              />

              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.items.join(" · ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
