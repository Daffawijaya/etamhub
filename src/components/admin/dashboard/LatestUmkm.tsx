"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import { getUmkmImage } from "@/lib/getUmkmImage";
import type { Umkm } from "@/data/umkm";
import type { Product } from "@/types/product";

interface BadgeInfo {
  id: string;
  level: string;
}

interface Props {
  umkms: Umkm[];
  umkmBadges?: BadgeInfo[];
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-3.5 w-3.5" />,
  silver: <SilverMedalIcon className="h-3.5 w-3.5" />,
  gold: <GoldMedalIcon className="h-3.5 w-3.5" />,
  platinum: <DiamondIcon className="h-3.5 w-3.5" />,
};

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  none: { bg: "bg-[#E8E8EE] dark:bg-[#3A3A4A]", text: "text-slate-400", label: "Belum Ada" },
  bronze: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", label: "Pemula" },
  silver: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", label: "Tumbuh" },
  gold: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", label: "Berkembang" },
  platinum: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", label: "Naik Kelas" },
};

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

type Tab = "umkm" | "produk";

export default function LatestUmkm({ umkms, umkmBadges = [] }: Props) {
  const [tab, setTab] = useState<Tab>("umkm");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const badgeMap = new Map(umkmBadges.map((b) => [b.id, b.level]));

  const latestUmkm = [...umkms]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // produk ikut filter dashboard (kecamatan/kategori/monitoring via umkms)
  const umkmIdsSet = new Set(umkms.map((u) => u.id));
  const displayedProducts = (() => {
    let list = products;
    // filter by umkms yang sudah kefilter (kecamatan/kategori/monitoring)
    if (umkms.length > 0) {
      list = list.filter((p: any) => umkmIdsSet.has(p.umkm_id));
    }
    return [...list]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  })();

  useEffect(() => {
    if (tab === "produk" && products.length === 0) {
      setLoadingProducts(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((result) => {
          const data = result.data ?? result ?? [];
          // ambil array produk (API return {data: [...]})
          const arr = Array.isArray(data) ? data : data.data ?? [];
          setProducts(arr);
        })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [tab, products.length]);

  return (
    <>
      {/* Tabs — standalone above the card */}
      <div className="flex gap-1">
        <button
          onClick={() => setTab("umkm")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "umkm"
              ? "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-white/[0.03]"
          }`}
        >
          UMKM
        </button>
        <button
          onClick={() => setTab("produk")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "produk"
              ? "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-white/[0.03]"
          }`}
        >
          Produk
        </button>
      </div>

      {/* Card content */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card py-3 transition-colors duration-300">
      {tab === "umkm" ? (
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {latestUmkm.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">Tidak ada UMKM sesuai filter</div>
          ) : (
            latestUmkm.map((item) => {
              const level = badgeMap.get(item.id) ?? "none";
              const badge = BADGE_STYLES[level] ?? BADGE_STYLES.none;
              const kategoriColors: Record<string, string> = {
                Perdagangan: "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300",
                Jasa: "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
                Industri: "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
              };
              const kategoriStyle = kategoriColors[item.kategori ?? ""] ?? "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";

              return (
                <Link
                  key={item.id}
                  href={`/admin/umkm/${item.id}`}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                >
                  {/* Kiri: gambar + nama + subkategori */}
                  <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                    <Image src={getUmkmImage(item.gambar)} alt={item.nama} fill sizes="40px" className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white capitalize text-left">{item.nama}</h4>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.subkategori || "-"}</p>
                  </div>

                  {/* 3 kolom di kanan — per kolom rapi, mulai dari kategori di ujung kanan */}
                  <div className="ml-2 hidden shrink-0 items-center gap-3 sm:flex">
                    <div className="w-[110px] shrink-0 flex justify-start">
                      <span className={`inline-flex shrink-0 items-center justify-start truncate rounded-lg px-2.5 py-1 text-xs font-medium ${kategoriStyle}`}>
                        {item.kategori || "Lainnya"}
                      </span>
                    </div>
                    <span className="w-[120px] shrink-0 truncate text-left text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.kecamatan || "-"}
                    </span>
                    <div className="w-[110px] shrink-0 flex justify-start">
                      <span className={`inline-flex items-center justify-start gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {BADGE_ICONS[level]}
                        {badge.label}
                      </span>
                    </div>
                  </div>
                  {/* Mobile: badge only di ujung kanan — tidak kepotong */}
                  <span className={`ml-2 inline-flex max-w-[92px] shrink-0 items-center justify-center gap-1 rounded-md sm:rounded-lg px-2 py-1 text-[10px] sm:text-xs font-medium sm:hidden ${badge.bg} ${badge.text} truncate`}>
                    <span className="hidden sm:inline">{BADGE_ICONS[level]}</span>
                    <span className="sm:hidden scale-90 origin-center">{BADGE_ICONS[level]}</span>
                    <span className="truncate">{badge.label}</span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {loadingProducts ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">Memuat produk...</div>
          ) : displayedProducts.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">
              {products.length === 0 ? "Belum ada produk" : "Tidak ada produk sesuai filter"}
            </div>
          ) : (
            displayedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/admin/umkm/${item.umkm_id}`}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
              >
                {/* Kiri: gambar + nama produk */}
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                  {item.gambar?.[0] ? (
                    <Image src={item.gambar[0]} alt={item.nama} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">-</div>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-left flex items-center">
                  <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white text-left">{item.nama}</h4>
                </div>

                {/* Kanan: 3 kolom — nama UMKM, kecamatan, harga */}
                <div className="ml-2 hidden shrink-0 items-center gap-3 sm:flex">
                  <span className="w-[140px] shrink-0 truncate text-left text-xs font-medium text-slate-700 dark:text-slate-200">
                    {(item as any).umkm?.nama ?? "-"}
                  </span>
                  <span className="w-[120px] shrink-0 truncate text-left text-sm font-medium text-slate-700 dark:text-slate-200">
                    {(item as any).umkm?.kecamatan ?? (item as any).kecamatan ?? "-"}
                  </span>
                  <div className="w-[110px] shrink-0 flex justify-start">
                    <span className="inline-flex shrink-0 items-center justify-start rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400">
                      {formatRupiah(item.harga)}
                    </span>
                  </div>
                </div>
                {/* Mobile: harga only — tidak kepotong */}
                <span className="ml-2 inline-flex max-w-[92px] shrink-0 items-center justify-center truncate rounded-md sm:rounded-lg bg-slate-50 px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400 sm:hidden">
                  <span className="truncate">{formatRupiah(item.harga)}</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
      </div>
    </>
  );
}
