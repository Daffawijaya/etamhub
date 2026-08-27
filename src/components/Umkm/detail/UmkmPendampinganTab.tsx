"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface MonitoringData {
  nib: string | null;
  npwp: string | null;
  kbli: string[] | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  nama: string | null;
  deskripsi: string | null;
  gambar: string[] | null;
  lat: number | null;
  lng: number | null;
}

type Props = {
  umkmId: string;
};

function formatItems(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]}, & ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} & ${items.at(-1)}`;
}

export default function UmkmPendampinganTab({ umkmId }: Props) {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [totalMonitoring, setTotalMonitoring] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/umkm/${umkmId}/monitoring`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.latest ?? null);
        setTotalMonitoring(res.totalMonitoring ?? 0);
      })
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

  if (!data || totalMonitoring === 0) {
    return (
      <div className="flex h-[34.5vh] items-center justify-center rounded-2xl bg-light-bg text-center dark:bg-white/[0.03]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          UMKM ini belum memiliki data pendampingan.
        </p>
      </div>
    );
  }

  const pendampingan = [
    {
      label: "Legalitas Usaha",
      items: [
        data.nib && "NIB",
        data.npwp && "NPWP",
        (data.kbli?.filter(Boolean).length ?? 0) > 0 && "KBLI",
      ].filter(Boolean) as string[],
    },
    {
      label: "Perizinan",
      items: [data.halal && "Halal", data.pirt && "PIRT"].filter(
        Boolean,
      ) as string[],
    },
    {
      label: "HKI",
      items: [data.haki && "HKI"].filter(Boolean) as string[],
    },
    {
      label: "Digital Marketing",
      items: [
        data.instagram && "Instagram",
        data.facebook && "Facebook",
        data.tiktok && "TikTok",
      ].filter(Boolean) as string[],
    },
    {
      label: "Branding",
      items: [
        data.nama && "Nama UMKM",
        data.deskripsi && "Deskripsi",
        (data.gambar?.length ?? 0) > 0 && "Foto UMKM",
      ].filter(Boolean) as string[],
    },
    {
      label: "Digitalisasi",
      items: [
        data.lat != null && data.lng != null && "Lokasi Maps",
      ].filter(Boolean) as string[],
    },
  ].filter((item) => item.items.length > 0);

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Berdasarkan {totalMonitoring}x monitoring admin kecamatan
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
                  {formatItems(item.items)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
