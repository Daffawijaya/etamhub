"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/api/products";

type Props = {
  umkmId: string;
};

const formatPrice = (value: number | null) => {
  if (value === null) return "Harga tidak tersedia";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PublicProductList({ umkmId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts({
        umkmId,
      });

      setProducts(data.filter((product) => product.is_available));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [umkmId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-6">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-white bg-light-bg dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="aspect-[5/4] animate-pulse bg-zinc-200 dark:bg-white/10" />

              <div className="space-y-2 p-3">
                <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Produk
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Produk yang tersedia dari UMKM ini
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => {
          const image = product.gambar?.[0];

          return (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
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
                    alt={product.nama}
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
                  title={product.nama}
                >
                  {product.nama}
                </h3>

                <p
                  className="mt-1 truncate text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                  title={formatPrice(product.harga)}
                >
                  {formatPrice(product.harga)}
                  {product.satuan && ` / ${product.satuan}`}
                </p>

                {product.deskripsi && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {product.deskripsi}
                  </p>
                )}

                {product.product_legalitas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.product_legalitas.map((legalitas) => (
                      <span
                        key={legalitas.id}
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
                        {legalitas.jenis === "kbli"
                          ? `KBLI ${legalitas.kode}`
                          : legalitas.jenis.toUpperCase()}
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
