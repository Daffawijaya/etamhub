"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { MapPin, Tag, ArrowRight, Store, MessageCircle, Eye } from "lucide-react";
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

/* ─── Gallery ─── */
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
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white bg-light dark:border-white/10 dark:bg-[#161616]">
        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
          Tidak ada gambar
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white bg-light dark:border-white/10 dark:bg-[#161616]">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_40%)] pointer-events-none z-10" />

        <Image
          src={imageUrl(images[active])}
          alt={nama}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />

        {/* Image counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-[72px] sm:w-[72px] ${
                active === i
                  ? "border-violet-500 shadow-[0_0_0_2px_rgba(139,92,246,0.2)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={imageUrl(img)}
                alt={`${nama} ${i + 1}`}
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

/* ─── Info ─── */
function ProductInfo({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="space-y-5">
      {/* Name & Price */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white lg:text-[28px]">
          {product.nama}
        </h1>

        {product.harga !== null && (
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatPrice(product.harga)}
            {product.satuan && (
              <span className="ml-1 text-sm font-normal text-zinc-400 dark:text-zinc-500">
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

      {/* Divider */}
      <div className="border-t border-zinc-100 dark:border-white/5" />

      {/* Description */}
      {product.deskripsi && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Deskripsi
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {product.deskripsi}
          </p>
        </div>
      )}

      {/* Legalitas */}
      {product.product_legalitas.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Legalitas
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.product_legalitas.map((leg: ProductLegalitas) => (
              <span
                key={leg.id}
                className="inline-flex items-center gap-1 rounded-lg border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-300"
              >
                <Tag size={10} />
                {leg.jenis === "kbli"
                  ? `KBLI ${leg.kode}`
                  : leg.jenis.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── UMKM Card ─── */
function UmkmCard({ umkm }: { umkm: UmkmData }) {
  const whatsappNumber = umkm.whatsapp
    ?.replace(/\D/g, "")
    .replace(/^0/, "62");

  return (
    <div className="rounded-2xl border border-white bg-light p-4 dark:border-white/10 dark:bg-[#161616]">
      <div className="flex items-center gap-3">
        {umkm.gambar && umkm.gambar.length > 0 ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={imageUrl(umkm.gambar[0])}
              alt={umkm.nama}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Store size={18} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Link
            href={`/umkm/${umkm.id}`}
            className="block truncate text-sm font-semibold text-zinc-900 transition-colors hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
          >
            {umkm.nama}
          </Link>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500">
            <MapPin size={11} className="shrink-0" />
            {umkm.kecamatan}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {whatsappNumber && (
          <button
            onClick={() =>
              window.open(`https://wa.me/${whatsappNumber}`, "_blank")
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={13} />
            WhatsApp
          </button>
        )}

        <Link
          href={`/umkm/${umkm.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:text-violet-400"
        >
          <Store size={13} />
          Lihat UMKM
        </Link>
      </div>
    </div>
  );
}

/* ─── Other Products ─── */
function OtherProducts({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Produk
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Produk lain dari UMKM ini
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p) => {
          const image = p.gambar?.[0];

          return (
            <Link
              key={p.id}
              href={`/produk/${p.id}`}
              className="
                group
                min-w-0
                overflow-hidden
                rounded-xl
                border
                border-white
                bg-light-bg
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                dark:border-white/10
                dark:bg-white/[0.03]
              "
            >
              <div className="aspect-[5/4] overflow-hidden bg-zinc-100 dark:bg-white/[0.03]">
                {image ? (
                  <img
                    src={image}
                    alt={p.nama}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3
                  className="truncate text-sm font-semibold text-zinc-900 dark:text-white"
                  title={p.nama}
                >
                  {p.nama}
                </h3>

                <p
                  className="mt-1 truncate text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                  title={formatPrice(p.harga) ?? "Harga tidak tersedia"}
                >
                  {formatPrice(p.harga) ?? "Harga tidak tersedia"}
                  {p.satuan && ` / ${p.satuan}`}
                </p>

                {p.deskripsi && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {p.deskripsi}
                  </p>
                )}

                {p.product_legalitas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.product_legalitas.map((leg) => (
                      <span
                        key={leg.id}
                        className="
                          max-w-full
                          truncate
                          rounded-md
                          border
                          border-white
                          bg-white
                          px-1.5
                          py-1
                          text-[9px]
                          font-medium
                          text-zinc-600
                          dark:border-white/10
                          dark:bg-white/[0.03]
                          dark:text-zinc-300
                        "
                      >
                        {leg.jenis === "kbli"
                          ? `KBLI ${leg.kode}`
                          : leg.jenis.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    Lihat detail
                  </span>

                  <span
                    className="
                      inline-flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white
                      bg-white
                      text-zinc-500
                      transition-colors
                      group-hover:text-emerald-600
                      dark:border-white/10
                      dark:bg-white/[0.03]
                      dark:text-zinc-400
                      dark:group-hover:text-emerald-400
                    "
                  >
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

/* ─── Main ─── */
export default function ProductDetailPage({
  product,
  umkm,
  otherProducts,
}: Props) {
  return (
    <>
      {/* Two-column layout */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Left: Gallery */}
          <div className="w-full min-w-0">
            <ProductGallery images={product.gambar} nama={product.nama} />
          </div>

          {/* Right: Info + UMKM */}
          <div className="w-full min-w-0 space-y-5">
            <ProductInfo product={product} />
            {umkm && <UmkmCard umkm={umkm} />}
          </div>
        </div>
      </div>

      {/* Related products */}
      <OtherProducts products={otherProducts} />
    </>
  );
}
