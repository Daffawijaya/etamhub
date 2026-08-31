"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  Globe,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { getUmkmImage } from "@/lib/getUmkmImage";

interface Props {
  data: any;
}

function Item({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-900 dark:text-white break-words">
        {value || "-"}
      </p>
    </div>
  );
}

export default function UmkmDetail({ data }: Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}

      <div className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {data.nama}
            </h1>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {data.kategori}
              {data.subkategori && ` • ${data.subkategori}`}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold
            ${
              data.published
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
            }`}
          >
            {data.published ? "Published" : "Draft"}
          </div>
        </div>
      </div>

      {/* Galeri */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <ImageIcon size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Galeri UMKM
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {data.gambar?.length ? (
            data.gambar.map((img: string, i: number) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <Image
                  src={getUmkmImage(img)}
                  alt={`${data.nama} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="text-slate-500">Tidak ada gambar</div>
          )}
        </div>
      </section>

      {/* Informasi UMKM */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Informasi UMKM
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Item label="Nama UMKM" value={data.nama} />

          <Item label="Kategori" value={data.kategori} />

          <Item label="Subkategori" value={data.subkategori} />

          <Item label="Deskripsi" value={data.deskripsi} />
        </div>
      </section>

      {/* Pemilik */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <User size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Data Pemilik
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Item label="Pemilik" value={data.pemilik} />

          <Item label="NIK" value={data.nik} />

          <Item label="Jenis Kelamin" value={data.jenis_kelamin} />

          <Item label="Email" value={data.email} />
        </div>
      </section>

      {/* Legalitas */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <BadgeCheck size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Legalitas Usaha
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Item label="NIB" value={data.nib} />

          <Item
            label="KBLI"
            value={Array.isArray(data.kbli) ? data.kbli.join(", ") : data.kbli}
          />

          <Item label="NPWP" value={data.npwp} />

          <Item label="Halal" value={data.halal} />

          <Item label="PIRT" value={data.pirt} />

          <Item label="HAKI" value={data.haki} />
        </div>
      </section>

      {/* Lokasi */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Lokasi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Item label="Kecamatan" value={data.kecamatan} />

          <Item label="Alamat" value={data.alamat} />

          <Item label="Latitude" value={data.lat} />

          <Item label="Longitude" value={data.lng} />
        </div>
      </section>

      {/* Kontak */}

      <section className="rounded-2xl bg-white dark:bg-dark-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe size={18} />

          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
            Kontak & Media Sosial
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Item label="WhatsApp" value={data.whatsapp} />

          <Item label="Instagram" value={data.instagram} />

          <Item label="Facebook" value={data.facebook} />

          <Item label="TikTok" value={data.tiktok} />
        </div>
      </section>
    </div>
  );
}
