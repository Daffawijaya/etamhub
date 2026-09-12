"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Package,
  RotateCcw,
  Store,
} from "lucide-react";
import {
  filterCatalogProducts,
  type CatalogProduct,
} from "@/lib/products/catalog";
import { imageUrl } from "@/lib/imageUrl";
import CatalogPagination from "@/components/ui/CatalogPagination";
import UmkmBadge from "@/components/ui/UmkmBadge";
import FilterSheet from "@/components/ui/FilterSheet";
import CustomSelect from "@/components/ui/CustomSelect";

type Props = {
  products: CatalogProduct[];
  search?: string;
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
}

const PAGE_SIZE = 12;

const priceOptions = [
  { value: "", label: "Semua harga" },
  { value: "under-25", label: "Di bawah Rp25 ribu" },
  { value: "25-50", label: "Rp25–50 ribu" },
  { value: "50-100", label: "Rp50–100 ribu" },
  { value: "above-100", label: "Di atas Rp100 ribu" },
  { value: "unpriced", label: "Hubungi UMKM" },
];

const sortOptions = [
  { value: "newest", label: "Produk terbaru" },
  { value: "name", label: "Nama A–Z" },
  { value: "price-low", label: "Harga terendah" },
  { value: "price-high", label: "Harga tertinggi" },
];

const formatPrice = (price: number | null) =>
  price === null
    ? "Hubungi UMKM"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(price);

function ProductCard({ product }: { product: CatalogProduct }) {
  const image = product.gambar[0];
  const legalitas = product.product_legalitas
    .filter((item) => item.jenis !== "kbli")
    .slice(0, 2);

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
      <Link href={`/produk/${product.slug}`} className="block h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white bg-light transition-colors duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-[#1b1b1b] dark:hover:border-zinc-700">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.1),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative aspect-[16/10] overflow-hidden bg-[#dddde9] dark:bg-zinc-900">
            {image ? (
              <Image
                src={imageUrl(image)}
                alt={`${product.nama} dari ${product.umkm.nama}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-[#dddde9] to-pink-100 text-violet-500 dark:from-violet-950/40 dark:via-zinc-900 dark:to-pink-950/30 dark:text-violet-300">
                <Package size={42} strokeWidth={1.4} />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            <UmkmBadge
              badge={product.umkm.badge}
              className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 sm:p-4">
              <span className="inline-flex max-w-[70%] truncate rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                {product.umkm.subkategori ||
                  product.umkm.kategori ||
                  "Produk lokal"}
              </span>

              {legalitas.length > 0 && (
                <div className="flex gap-1">
                  {legalitas.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-black/40 px-2 py-1 text-[9px] font-semibold uppercase text-white backdrop-blur-sm"
                    >
                      {item.jenis}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative z-20 flex flex-1 flex-col p-2.5 sm:p-5">
            <div className="mb-1.5 flex min-w-0 items-center gap-2 text-[10px] text-zinc-500 sm:mb-3 sm:text-xs dark:text-zinc-400">
              <span className="inline-flex min-w-0 items-center gap-1 truncate sm:gap-1.5">
                <Store size={12} className="shrink-0" />
                <span className="truncate">{product.umkm.nama}</span>
              </span>
              {product.umkm.kecamatan && (
                <span className="hidden min-w-0 items-center gap-2 sm:inline-flex">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                  <span className="inline-flex min-w-0 items-center gap-1 truncate">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{product.umkm.kecamatan}</span>
                  </span>
                </span>
              )}
            </div>

            <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-zinc-900 transition group-hover:text-violet-700 sm:text-xl dark:text-white dark:group-hover:text-violet-300">
              {product.nama}
            </h3>

            {product.deskripsi && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500 max-sm:hidden dark:text-zinc-400">
                {product.deskripsi}
              </p>
            )}

            <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
              <div className="min-w-0">
                <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400 sm:block dark:text-zinc-500">
                  Harga
                </p>
                <p className="truncate text-[13px] font-semibold text-zinc-900 sm:mt-1 sm:text-base dark:text-white">
                  {formatPrice(product.harga)}
                  {product.harga !== null && product.satuan
                    ? ` / ${product.satuan}`
                    : ""}
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

export default function ProductCatalog({ products, search = "" }: Props) {
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [applied, setApplied] = useState({
    category: "",
    district: "",
    price: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((product) => product.umkm.kategori)
            .filter((value): value is string => Boolean(value)),
        ),
      ]
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((value) => ({ value, label: value })),
    [products],
  );

  const districts = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((product) => product.umkm.kecamatan)
            .filter((value): value is string => Boolean(value)),
        ),
      ]
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((value) => ({ value, label: value })),
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      filterCatalogProducts(products, {
        search,
        category: applied.category,
        district: applied.district,
        price: applied.price,
        sort: applied.sort,
      }),
    [products, search, applied],
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visibleProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const umkmCount = new Set(
    filteredProducts.map((product) => product.umkm.id),
  ).size;
  const activeFilterCount =
    [applied.category, applied.district, applied.price].filter(Boolean).length +
    (applied.sort === "newest" ? 0 : 1);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document
      .getElementById("product-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setCategory("");
    setDistrict("");
    setPrice("");
    setSort("newest");
    setApplied({ category: "", district: "", price: "", sort: "newest" });
    setPage(1);
  };

  const applyFilters = () => {
    setApplied({ category, district, price, sort });
    setPage(1);
  };

  return (
    <section id="product-results" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
              Jelajahi Produk UMKM
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filteredProducts.length} produk dari {umkmCount} UMKM
              {search ? ` untuk “${search}”` : ""}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="hidden items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 sm:inline-flex dark:text-zinc-400 dark:hover:text-white"
              >
                <RotateCcw size={14} />
                Reset {activeFilterCount} filter
              </button>
            )}
            <FilterSheet
            accent="violet"
            activeCount={activeFilterCount}
            onReset={resetFilters}
            onApply={applyFilters}
            discardOnClose
          >
            <FilterField label="Kategori UMKM">
              <CustomSelect
                accent="violet"
                value={category}
                onChange={setCategory}
                placeholder="Semua kategori"
                options={[
                  { value: "", label: "Semua kategori" },
                  ...categories,
                ]}
              />
            </FilterField>
            <FilterField label="Kecamatan">
              <CustomSelect
                accent="violet"
                value={district}
                onChange={setDistrict}
                placeholder="Semua kecamatan"
                options={[
                  { value: "", label: "Semua kecamatan" },
                  ...districts,
                ]}
              />
            </FilterField>
            <FilterField label="Rentang harga">
              <CustomSelect
                accent="violet"
                value={price}
                onChange={setPrice}
                placeholder="Semua harga"
                options={priceOptions}
              />
            </FilterField>
            <FilterField label="Urutkan produk">
              <CustomSelect
                accent="violet"
                value={sort}
                onChange={setSort}
                placeholder="Produk terbaru"
                options={sortOptions}
              />
            </FilterField>
          </FilterSheet>
          </div>
        </div>
      </motion.div>

      {visibleProducts.length > 0 ? (
        <motion.div
          key={`${search}-${applied.category}-${applied.district}-${applied.price}-${applied.sort}-${safePage}`}
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
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-white bg-light px-5 text-center dark:border-zinc-800 dark:bg-[#1b1b1b]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-violet-500 dark:bg-white/5 dark:text-violet-300">
            <Package size={23} />
          </span>
          <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
            Produk belum ditemukan
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Coba kata kunci lain atau atur ulang filter penelusuran.
          </p>
          {(search || activeFilterCount > 0) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-zinc-900 dark:text-white">
              {search && (
                <Link
                  href="/produk"
                  scroll={false}
                  className="underline underline-offset-4"
                >
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

      <CatalogPagination
        page={safePage}
        totalPages={totalPages}
        onChange={changePage}
      />
    </section>
  );
}
