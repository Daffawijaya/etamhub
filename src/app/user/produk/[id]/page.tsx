"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProduct } from "@/lib/api/products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const formatPrice = (value: number | null) => {
  if (value === null) return "Harga tidak tersedia";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const getLegalitasLabel = (jenis: string) => {
  switch (jenis) {
    case "halal":
      return "Halal";
    case "pirt":
      return "PIRT";
    case "haki":
      return "HAKI";
    case "kbli":
      return "KBLI";
    default:
      return jenis.toUpperCase();
  }
};

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { id } = await params;
      const data = await getProduct(id);

      setProduct(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil detail produk.",
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="px-6">
          <div className="flex min-h-96 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Memuat detail produk...
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="px-6 w-full">
        <div className="">
          <Link
            href="/user"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>

          <div className="rounded-xl bg-gray-50 px-6 py-12 text-center dark:bg-dark-card">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error || "Produk tidak ditemukan."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const image = product.gambar?.[0];

  return (
    <main className="">
      <div className="px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/user"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>

          <Link
            href={`/user/produk/${product.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Pencil size={16} />
            Edit Produk
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-xl bg-dark-card">
            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#202020]">
              {image ? (
                <img
                  src={image}
                  alt={product.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-gray-600">
                  Tidak ada gambar
                </div>
              )}
            </div>

            {product.gambar.length > 1 && (
              <div className="grid grid-cols-4 gap-3 p-4">
                {product.gambar.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#202020]"
                  >
                    <img
                      src={item}
                      alt={`${product.nama} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl bg-dark-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.nama}
                </h1>

                {product.umkm && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.umkm.nama}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  product.is_available
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-gray-200 text-gray-600 dark:bg-[#242424] dark:text-gray-500"
                }`}
              >
                {product.is_available ? "Tersedia" : "Tidak tersedia"}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(product.harga)}
              </p>

              {product.satuan && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  per {product.satuan}
                </p>
              )}
            </div>

            <div className="my-6 h-px bg-gray-200 dark:bg-[#292929]" />

            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Deskripsi
              </h2>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400">
                {product.deskripsi || "Tidak ada deskripsi produk."}
              </p>
            </div>

            {product.product_legalitas.length > 0 && (
              <>
                <div className="my-6 h-px bg-gray-200 dark:bg-[#292929]" />

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Legalitas Produk
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.product_legalitas.map((legalitas) => (
                      <div
                        key={legalitas.id}
                        className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-[#202020]"
                      >
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {getLegalitasLabel(legalitas.jenis)}
                        </p>

                        {legalitas.kode && (
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                            {legalitas.kode}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="my-6 h-px bg-gray-200 dark:bg-[#292929]" />

            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Informasi Produk
              </h2>

              <dl className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-gray-500 dark:text-gray-500">
                    Ditambahkan
                  </dt>
                  <dd className="text-right text-gray-700 dark:text-gray-300">
                    {formatDate(product.created_at)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-gray-500 dark:text-gray-500">
                    Diperbarui
                  </dt>
                  <dd className="text-right text-gray-700 dark:text-gray-300">
                    {formatDate(product.updated_at)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
