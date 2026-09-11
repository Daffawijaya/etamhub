"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  MapPin,
  RotateCcw,
  Store,
} from "lucide-react";
import {
  filterCatalogUmkms,
  type CatalogUmkm,
} from "@/lib/umkm/catalog";
import { imageUrl } from "@/lib/imageUrl";
import CatalogPagination from "@/components/ui/CatalogPagination";

type Props = {
  umkms: CatalogUmkm[];
  search?: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "newest", label: "UMKM terbaru" },
  { value: "name", label: "Nama A–Z" },
  { value: "products", label: "Produk terbanyak" },
];

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label className="relative w-36 shrink-0 sm:w-auto sm:min-w-44 sm:flex-1">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-white bg-light-card px-3 pr-9 text-xs font-medium text-zinc-700 outline-none transition hover:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 sm:h-11 sm:px-4 sm:pr-10 sm:text-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
      />
    </label>
  );
}

function UmkmCard({ umkm }: { umkm: CatalogUmkm }) {
  const image = umkm.gambar[0];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <Link href={`/umkm/${umkm.slug}`} className="block h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white bg-light transition-colors duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-[#1b1b1b] dark:hover:border-zinc-700">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.1),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative aspect-[16/10] overflow-hidden bg-[#dddde9] dark:bg-zinc-900">
            {image ? (
              <Image
                src={imageUrl(image)}
                alt={umkm.nama}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-[#dddde9] to-pink-100 text-violet-500 dark:from-violet-950/40 dark:via-zinc-900 dark:to-pink-950/30 dark:text-violet-300">
                <Store size={42} strokeWidth={1.4} />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 sm:p-4">
              <span className="inline-flex max-w-[70%] truncate rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                {umkm.subkategori || umkm.kategori || "UMKM lokal"}
              </span>
            </div>
          </div>

          <div className="relative z-20 flex flex-1 flex-col p-2.5 sm:p-5">
            <div className="mb-1.5 flex min-w-0 items-center gap-2 text-[10px] text-zinc-500 sm:mb-3 sm:text-xs dark:text-zinc-400">
              {umkm.kecamatan && (
                <span className="hidden min-w-0 items-center gap-1 sm:inline-flex">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{umkm.kecamatan}</span>
                </span>
              )}
              {umkm.kecamatan && umkm.kategori && (
                <span className="hidden h-1 w-1 shrink-0 rounded-full bg-zinc-400 sm:block" />
              )}
              {umkm.kategori && (
                <span className="inline-flex min-w-0 items-center gap-1 truncate sm:gap-1.5">
                  <Store size={12} className="shrink-0" />
                  <span className="truncate">{umkm.kategori}</span>
                </span>
              )}
            </div>

            <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-zinc-900 transition group-hover:text-violet-700 sm:text-xl dark:text-white dark:group-hover:text-violet-300">
              {umkm.nama}
            </h3>

            {umkm.deskripsi && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500 max-sm:hidden dark:text-zinc-400">
                {umkm.deskripsi}
              </p>
            )}

            <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
              <div className="min-w-0">
                <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400 sm:block dark:text-zinc-500">
                  Produk
                </p>
                <p className="truncate text-[13px] font-semibold text-zinc-900 sm:mt-1 sm:text-base dark:text-white">
                  {umkm.productCount > 0
                    ? `${umkm.productCount} produk`
                    : "Belum ada produk"}
                </p>
              </div>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-10 sm:w-10 dark:bg-white dark:text-black">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default function UmkmCatalog({ umkms, search = "" }: Props) {
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () =>
      [...new Set(umkms.map((umkm) => umkm.kategori).filter(Boolean) as string[])]
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((value) => ({ value, label: value })),
    [umkms],
  );

  const districts = useMemo(
    () =>
      [...new Set(umkms.map((umkm) => umkm.kecamatan).filter(Boolean) as string[])]
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((value) => ({ value, label: value })),
    [umkms],
  );

  const filteredUmkms = useMemo(
    () => filterCatalogUmkms(umkms, { search, category, district, sort }),
    [umkms, search, category, district, sort],
  );

  const totalPages = Math.ceil(filteredUmkms.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visibleUmkms = filteredUmkms.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const totalProducts = filteredUmkms.reduce(
    (sum, umkm) => sum + umkm.productCount,
    0,
  );
  const activeFilterCount =
    [category, district].filter(Boolean).length + (sort === "newest" ? 0 : 1);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document
      .getElementById("umkm-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setCategory("");
    setDistrict("");
    setSort("newest");
  };

  return (
    <section id="umkm-results" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
              Jelajahi UMKM
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filteredUmkms.length} UMKM • {totalProducts} produk
              {search ? ` untuk “${search}”` : ""}
            </p>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              <RotateCcw size={14} />
              Reset {activeFilterCount} filter
            </button>
          )}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto rounded-2xl border border-white bg-light p-3 sm:overflow-visible dark:border-zinc-800 dark:bg-[#1b1b1b]">
          <FilterSelect
            label="Kategori UMKM"
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            options={[{ value: "", label: "Semua kategori" }, ...categories]}
          />
          <FilterSelect
            label="Kecamatan"
            value={district}
            onChange={(value) => {
              setDistrict(value);
              setPage(1);
            }}
            options={[{ value: "", label: "Semua kecamatan" }, ...districts]}
          />
          <FilterSelect
            label="Urutkan UMKM"
            value={sort}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            options={sortOptions}
          />
        </div>
      </motion.div>

      {visibleUmkms.length > 0 ? (
        <motion.div
          key={`${search}-${category}-${district}-${sort}-${safePage}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.06 },
            },
          }}
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {visibleUmkms.map((umkm) => (
            <UmkmCard key={umkm.id} umkm={umkm} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-white bg-light px-5 text-center dark:border-zinc-800 dark:bg-[#1b1b1b]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-violet-500 dark:bg-white/5 dark:text-violet-300">
            <Store size={23} />
          </span>
          <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
            UMKM belum ditemukan
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Coba kata kunci lain atau atur ulang filter penelusuran.
          </p>
          {(search || activeFilterCount > 0) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-zinc-900 dark:text-white">
              {search && (
                <Link href="/produk" scroll={false} className="underline underline-offset-4">
                  Hapus pencarian
                </Link>
              )}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="underline underline-offset-4"
                >
                  Hapus filter
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

      <CatalogPagination page={safePage} totalPages={totalPages} onChange={changePage} />
    </section>
  );
}
