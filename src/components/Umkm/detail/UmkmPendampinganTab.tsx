"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  data: {
    nama?: string | null;
    deskripsi?: string | null;
    gambar?: string[] | null;
    nib?: string | null;
    npwp?: string | null;
    kbli?: string[] | null;
    halal?: string | null;
    pirt?: string | null;
    haki?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    whatsapp?: string | null;
    lat?: number | null;
    lng?: number | null;
  };
};

export default function UmkmPendampinganTab({ data }: Props) {
  const formatItems = (items: string[]) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]}, & ${items[1]}`;

    return `${items.slice(0, -1).join(", ")} & ${items.at(-1)}`;
  };

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
        data.whatsapp && "WhatsApp",
        data.lat != null && data.lng != null && "Lokasi Maps",
      ].filter(Boolean) as string[],
    },
  ].filter((item) => item.items.length > 0);

  if (pendampingan.length === 0) {
    return (
      <div
        className="
          flex
          h-[34.5vh]
          items-center
          justify-center
          rounded-2xl
          bg-light-bg
          text-center
          dark:bg-white/[0.03]
        "
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          UMKM ini belum memiliki data pendampingan.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
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
