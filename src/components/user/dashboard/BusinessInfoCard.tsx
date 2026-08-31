"use client";

import {
  Building2,
  FileText,
  Image as ImageIcon,
  MapPin,
  Phone,
} from "lucide-react";

type Props = {
  umkm: {
    id: string;
    nama: string;
    pemilik: string;
    kategori: string;
    subkategori: string;
    deskripsi: string;
    kecamatan: string;
    alamat: string;
    whatsapp: string;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    gambar_count: number;
  } | null;
};

export default function BusinessInfoCard({ umkm }: Props) {
  if (!umkm) {
    return (
      <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Informasi Usaha
        </h2>

        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center sm:p-8 dark:border-white/[0.06]">
          <Building2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />

          <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
            Belum memiliki data UMKM
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Silakan lengkapi data UMKM untuk melihat informasi usaha.
          </p>
        </div>
      </div>
    );
  }

  const items = [
    {
      label: "Nama Usaha",
      value: umkm.nama,
      icon: Building2,
    },
    {
      label: "Lokasi",
      value: umkm.kecamatan,
      icon: MapPin,
    },
    {
      label: "Kategori",
      value: umkm.kategori,
      icon: FileText,
    },
    {
      label: "WhatsApp",
      value: umkm.whatsapp,
      icon: Phone,
    },
    {
      label: "Foto Usaha",
      value: `${umkm.gambar_count} Foto`,
      icon: ImageIcon,
    },
  ];

  return (
    <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Informasi Usaha
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.03]">
                <Icon size={18} className="text-slate-500 dark:text-slate-400" />
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{item.label}</p>

                <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.value || "-"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
