"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { deleteProduct, getProducts } from "@/lib/api/products";

type Props = {
  umkmId: string;
  onAdd?: () => void;
  onEdit?: (product: Product) => void;
};

const formatPrice = (value: number | null) => {
  if (value === null) return "Harga tidak tersedia";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ProductList({ umkmId, onAdd, onEdit }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        umkmId,
      });

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data produk.",
      );
    } finally {
      setLoading(false);
    }
  }, [umkmId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Hapus produk "${product.nama}"?`);

    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      setError("");

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus produk.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat produk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Produk
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola produk yang dimiliki UMKM ini.
          </p>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <Plus size={17} />
            Tambah Produk
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Belum ada produk
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tambahkan produk pertama untuk UMKM ini.
          </p>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <Plus size={17} />
              Tambah Produk
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = product.gambar?.[0];

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                  {image ? (
                    <img
                      src={image}
                      alt={product.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                        {product.nama}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                        {formatPrice(product.harga)}
                        {product.satuan && ` / ${product.satuan}`}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.is_available
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {product.is_available ? "Tersedia" : "Tidak tersedia"}
                    </span>
                  </div>

                  {product.deskripsi && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {product.deskripsi}
                    </p>
                  )}

                  {product.product_legalitas.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.product_legalitas.map((legalitas) => (
                        <span
                          key={legalitas.id}
                          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {legalitas.jenis === "kbli"
                            ? `KBLI ${legalitas.kode}`
                            : legalitas.jenis.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        disabled={deletingId === product.id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={15} />
                      {deletingId === product.id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
