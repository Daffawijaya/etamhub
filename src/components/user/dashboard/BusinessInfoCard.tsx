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
      <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
        <h2 className="text-lg font-semibold text-dark dark:text-light">
          Informasi Usaha
        </h2>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <Building2 size={36} className="mx-auto text-gray-400" />

          <p className="mt-3 font-medium text-dark dark:text-light">
            Belum memiliki data UMKM
          </p>

          <p className="mt-1 text-sm text-gray-500">
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
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-dark dark:text-light">
        Informasi Usaha
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex gap-3">
              <Icon size={20} className="text-primary" />

              <div>
                <p className="text-xs text-gray-500">{item.label}</p>

                <p className="text-sm font-medium text-dark dark:text-light">
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
