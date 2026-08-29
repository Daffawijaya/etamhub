"use client";

import { useState, useEffect } from "react";

import UmkmDescriptionTab from "./UmkmDescriptionTab";
import UmkmLegalityTab from "./UmkmLegalityTab";
import UmkmTabs from "./UmkmTabs";
import UmkmPendampinganTab from "./UmkmPendampinganTab";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";

type Props = {
  umkmId: string;
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

interface Badge {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
  label: string;
  color: string;
  bgColor: string;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-3.5 w-3.5" />,
  silver: <SilverMedalIcon className="h-3.5 w-3.5" />,
  gold: <GoldMedalIcon className="h-3.5 w-3.5" />,
  platinum: <DiamondIcon className="h-3.5 w-3.5" />,
};

const BADGE_RING: Record<string, string> = {
  bronze: "border-amber-300 dark:border-amber-600",
  silver: "border-emerald-300 dark:border-emerald-600",
  gold: "border-orange-300 dark:border-orange-600",
  platinum: "border-purple-300 dark:border-purple-600",
};

export default function UmkmInfo({
  umkmId,
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
  const [badge, setBadge] = useState<Badge | null>(null);

  useEffect(() => {
    fetch(`/api/umkm/${umkmId}/monitoring`)
      .then((res) => res.json())
      .then((res) => {
        if (res.badge && res.badge.level !== "none") {
          setBadge(res.badge);
        }
      })
      .catch(() => {});
  }, [umkmId]);

  return (
    <div
      className="
    group
    relative
    flex
    h-[500px]
    flex-col
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-white md:text-4xl">
          {nama}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
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

          {badge && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                BADGE_RING[badge.level] ?? ""
              } ${badge.bgColor} ${badge.color}`}
            >
              {BADGE_ICONS[badge.level]}
              {badge.label}
            </span>
          )}
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
        <div className="mt-6 min-h-0 flex-1 overflow-hidden">
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
            <UmkmPendampinganTab umkmId={umkmId} />
          )}
        </div>
      </div>
    </div>
  );
}
