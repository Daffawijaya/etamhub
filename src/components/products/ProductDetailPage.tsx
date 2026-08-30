"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { Eye, MapPin, Tag, ArrowRight } from "lucide-react";
import type { Product, ProductLegalitas } from "@/types/product";

type UmkmData = {
  id: string;
  nama: string;
  pemilik: string;
  kategori: string;
  subkategori: string;
  kecamatan: string;
  alamat: string;
  deskripsi: string;
  gambar: string[];
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  lat: number;
  lng: number;
  nib?: string | null;
  halal?: string | null;
  pirt?: string | null;
  haki?: string | null;
  kbli?: string[] | null;
};

type Props = {
  product: Product;
  umkm: UmkmData | null;
  otherProducts: Product[];
};

const formatPrice = (value: number | null) => {
  if (value === null) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

function ProductGallery({
  images,
  nama,
}: {
  images: string[];
  nama: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white bg-light dark:border-white/10 dark:bg-[#161616]">
        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
          Tidak ada gambar
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="group relative overflow-hidden rounded-xl border border-white bg-light dark:border-white/10 dark:bg-[#161616]">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_45%)] pointer-events-none z-10" />

        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl(images[active])}
            alt={nama}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-transparent transition-all duration-500 group-hover:w-full" />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                active === i
                  ? "border-violet-500/20 bg-violet-500/10 ring-2 ring-violet-500/20"
                  : "border-white hover:border-violet-500/20 dark:border-white/10"
              }`}
            >
              <Image
                src={imageUrl(img)}
                alt={`${nama}-${i}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductInfo({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="space-y-6">
      {/* Name & Price */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white md:text-3xl">
          {product.nama}
        </h1>

        {product.harga !== null && (
          <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatPrice(product.harga)}
            {product.satuan && (
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {" "}
                / {product.satuan}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            product.is_available
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              product.is_available ? "bg-emerald-500" : "bg-zinc-400"
            }`}
          />
          {product.is_available ? "Tersedia" : "Tidak Tersedia"}
        </span>
      </div>

      {/* Description */}
      {product.deskripsi && (
        <div className="rounded-xl border border-white bg-light p-5 dark:border-white/10 dark:bg-[#161616]">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Deskripsi
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {product.deskripsi}
          </p>
        </div>
      )}

      {/* Legalitas */}
      {product.product_legalitas.length > 0 && (
        <div className="rounded-xl border border-white bg-light p-5 dark:border-white/10 dark:bg-[#161616]">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Legalitas Produk
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.product_legalitas.map((leg: ProductLegalitas) => (
              <span
                key={leg.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
              >
                <Tag size={11} className="text-violet-500" />
                {leg.jenis === "kbli"
                  ? `KBLI ${leg.kode}`
                  : leg.jenis.toUpperCase()}
                {leg.kode && leg.jenis !== "kbli" && `: ${leg.kode}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UmkmMiniCard({ umkm }: { umkm: UmkmData }) {
  const whatsappNumber = umkm.whatsapp
    ?.replace(/\D/g, "")
    .replace(/^0/, "62");

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white bg-light p-5 dark:border-white/10 dark:bg-[#161616]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_45%)] pointer-events-none" />

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          UMKM
        </p>

        <Link
          href={`/umkm/${umkm.id}`}
          className="mt-1 block text-base font-semibold text-zinc-900 transition-colors hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
        >
          {umkm.nama}
        </Link>

        <div className="mt-3 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-start gap-2">
            <Tag size={12} className="mt-0.5 shrink-0 text-zinc-400" />
            <span>
              {umkm.kategori}
              {umkm.subkategori && ` · ${umkm.subkategori}`}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={12} className="mt-0.5 shrink-0 text-zinc-400" />
            <span>
              {umkm.kecamatan}
              {umkm.alamat && `, ${umkm.alamat}`}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {whatsappNumber && (
            <button
              onClick={() =>
                window.open(`https://wa.me/${whatsappNumber}`, "_blank")
              }
              className="w-full rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-600 transition-all hover:bg-violet-500/15 dark:text-violet-300 dark:hover:text-white"
            >
              Chat WhatsApp
            </button>
          )}

          <Link
            href={`/umkm/${umkm.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white bg-light-bg px-3 py-2 text-xs font-medium text-zinc-600 transition-all hover:border-violet-500/20 hover:bg-violet-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:text-white"
          >
            Lihat UMKM
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function OtherProducts({
  products,
  umkmId,
}: {
  products: Product[];
  umkmId: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Produk Lainnya
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Produk lain dari UMKM ini
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => {
          const image = product.gambar?.[0];

          return (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="group min-w-0 overflow-hidden rounded-xl border border-white bg-light-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="aspect-[5/4] overflow-hidden bg-zinc-100 dark:bg-white/[0.03]">
                {image ? (
                  <img
                    src={imageUrl(image)}
                    alt={product.nama}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-400">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3
                  className="truncate text-sm font-semibold text-zinc-900 dark:text-white"
                  title={product.nama}
                >
                  {product.nama}
                </h3>

                <p className="mt-1 truncate text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(product.harga) ?? "Harga tidak tersedia"}
                  {product.satuan && ` / ${product.satuan}`}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-zinc-400">
                    Lihat detail
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white bg-white text-zinc-500 transition-colors group-hover:text-emerald-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:group-hover:text-emerald-400">
                    <Eye size={13} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function ProductDetailPage({
  product,
  umkm,
  otherProducts,
}: Props) {
  return (
    <>
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
          {/* Left: Product Gallery + Info */}
          <div className="w-full min-w-0 space-y-6">
            <ProductGallery images={product.gambar} nama={product.nama} />
            <ProductInfo product={product} />
          </div>

          {/* Right: UMKM Sidebar */}
          <div className="w-full min-w-0">
            <div className="sticky top-24">
              {umkm && <UmkmMiniCard umkm={umkm} />}
            </div>
          </div>
        </div>
      </div>

      {/* Other Products */}
      <OtherProducts products={otherProducts} umkmId={product.umkm_id} />
    </>
  );
}
