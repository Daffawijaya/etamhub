"use client";

import { useState } from "react";

import UmkmDescriptionTab from "./UmkmDescriptionTab";
import UmkmLegalityTab from "./UmkmLegalityTab";
import UmkmTabs from "./UmkmTabs";
import UmkmPendampinganTab from "./UmkmPendampinganTab";

type Props = {
  nama: string;
  kategori: string;
  subkategori: string;
  kecamatan: string;
  deskripsi: string;

  gambar?: string[] | null;

  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;

  lat?: number | null;
  lng?: number | null;

  nib?: string | null;
  npwp?: string | null;
  halal?: string | null;
  pirt?: string | null;
  haki?: string | null;
  kbli?: string[] | null;
};

export default function UmkmInfo({
  nama,
  kategori,
  subkategori,
  kecamatan,
  deskripsi,
  nib,
  npwp,
  halal,
  pirt,
  haki,
  kbli,
  gambar,
  whatsapp,
  instagram,
  facebook,
  tiktok,
  lat,
  lng,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "deskripsi" | "legalitas" | "pendampingan"
  >("deskripsi");

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-white
        bg-light
        p-6
        dark:border-white/10
        dark:bg-[#161616]
      "
    >
      {/* Background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-light
          dark:bg-[#161616]
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-white md:text-4xl">
          {nama}
        </h1>

        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className="
              rounded-full
              border
              border-violet-500/20
              bg-violet-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-violet-600
              dark:text-violet-300
            "
          >
            {kategori}
          </span>

          <span
            className="
              rounded-full
              border
              border-white
              bg-light-bg
              px-3
              py-1
              text-xs
              font-medium
              text-zinc-600
              dark:border-white/10
              dark:bg-white/[0.03]
              dark:text-zinc-300
            "
          >
            {subkategori}
          </span>
        </div>

        {/* Kecamatan */}
        <div className="flex items-center gap-2 pt-2 text-sm">
          <p className="text-zinc-500">Kecamatan:</p>

          <p className="font-medium text-zinc-900 dark:text-white">
            {kecamatan}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-5">
          <UmkmTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "deskripsi" && (
            <UmkmDescriptionTab deskripsi={deskripsi} />
          )}

          {activeTab === "legalitas" && (
            <UmkmLegalityTab
              data={{
                nib,
                npwp,
                halal,
                pirt,
                haki,
                kbli,
              }}
            />
          )}

          {activeTab === "pendampingan" && (
            <UmkmPendampinganTab
              data={{
                nama,
                deskripsi,
                gambar,
                whatsapp,
                instagram,
                facebook,
                tiktok,
                lat,
                lng,
                nib,
                npwp,
                halal,
                pirt,
                haki,
                kbli,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
