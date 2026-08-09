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
      <section className="rounded-xl bg-white p-6 dark:bg-[#1b1b1b]">
        <div className="flex min-h-40 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600 dark:border-gray-700 dark:border-t-emerald-400" />
            Memuat produk...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-5 dark:bg-[#1b1b1b] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Produk
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Kelola produk yang dimiliki UMKM ini
            </p>
          </div>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus:ring-emerald-400 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-emerald-300 dark:disabled:bg-emerald-900 disabled:text-white/80 dark:disabled:text-white/50"
          >
            <Plus size={16} />
            Tambah Produk
          </button>
        )}
      </div>

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-[#151515]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Plus size={18} />
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-white">
            Belum ada produk
          </p>

          <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Tambahkan produk pertama untuk UMKM ini.
          </p>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus:ring-emerald-400 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-emerald-300 dark:disabled:bg-emerald-900 disabled:text-white/80 dark:disabled:text-white/50"
            >
              <Plus size={16} />
              Tambah Produk
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => {
            const image = product.gambar?.[0];

            return (
              <article
                key={product.id}
                className="group min-w-0 overflow-hidden rounded-xl bg-gray-50 transition-colors dark:bg-[#151515]"
              >
                <div className="aspect-[5/4] overflow-hidden bg-gray-100 dark:bg-[#202020]">
                  {image ? (
                    <img
                      src={image}
                      alt={product.nama}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-400 dark:text-gray-600">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="min-w-0">
                    <h3
                      className="truncate text-sm font-semibold text-gray-900 dark:text-white"
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
                  </div>

                  <div className="mt-2">
                    <span
                      className={`inline-flex max-w-full truncate rounded-full px-2 py-1 text-[10px] font-medium ${
                        product.is_available
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-gray-200 text-gray-600 dark:bg-[#242424] dark:text-gray-500"
                      }`}
                    >
                      {product.is_available ? "Tersedia" : "Tidak tersedia"}
                    </span>
                  </div>

                  {product.deskripsi && (
                    <p className="mt-2 line-clamp-1 text-xs leading-5 text-gray-500 dark:text-gray-500">
                      {product.deskripsi}
                    </p>
                  )}

                  {product.product_legalitas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.product_legalitas.map((legalitas) => (
                        <span
                          key={legalitas.id}
                          className="max-w-full truncate rounded-md bg-gray-200/70 px-1.5 py-1 text-[9px] font-medium text-gray-600 dark:bg-[#242424] dark:text-gray-500"
                          title={
                            legalitas.jenis === "kbli"
                              ? `KBLI ${legalitas.kode}`
                              : legalitas.jenis.toUpperCase()
                          }
                        >
                          {legalitas.jenis === "kbli"
                            ? `KBLI ${legalitas.kode}`
                            : legalitas.jenis.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex gap-1.5">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        disabled={deletingId === product.id}
                        title="Edit produk"
                        className="inline-flex flex-1 items-center justify-center rounded-lg bg-white p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#202020] dark:text-gray-400 dark:hover:bg-[#292929] dark:hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      title="Hapus produk"
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={14} />
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
