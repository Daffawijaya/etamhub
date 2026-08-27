"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { getUmkmImage } from "@/lib/getUmkmImage";
import { Eye } from "lucide-react";

interface UmkmMonitoring {
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
}

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function MonitoringPage() {
  const [umkms, setUmkms] = useState<UmkmMonitoring[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/monitoring")
      .then((res) => res.json())
      .then(setUmkms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <main className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Monitoring UMKM
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pantau perkembangan UMKM di kecamatan Anda
          </p>
        </div>

        {umkms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {umkms.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                {/* Gambar */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={getUmkmImage(item.gambar)}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white capitalize">
                    {item.nama}
                  </h3>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {item.kecamatan} · {item.kategori}
                  </p>
                </div>

                {/* Latest Monitoring Info */}
                <div className="hidden w-[200px] flex-shrink-0 text-right sm:block">
                  {item.latestMonitoring ? (
                    <>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {formatRupiah(item.latestMonitoring.omzet)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.monitoringCount}x monitoring
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400">Belum ada monitoring</p>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/admin/monitoring/${item.id}`}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                >
                  <Eye size={15} />
                  Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
