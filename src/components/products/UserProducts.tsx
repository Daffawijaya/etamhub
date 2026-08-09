"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductForm from "./form/ProductForm";
import ProductList from "@/components/products/ProductList";

type UmkmLegalitas = {
  halal?: string | null;
  pirt?: string | null;
  haki?: string | null;
  kbli?: string[] | null;
};

type Props = {
  umkmId: string;
  legalitas: UmkmLegalitas;
};

export default function UserProducts({ umkmId, legalitas }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    setRefreshKey((current) => current + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <section className="rounded-xl bg-white p-5 dark:bg-[#1b1b1b] sm:p-6">
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {editingProduct
                ? "Perbarui informasi produk dan legalitasnya."
                : "Tambahkan produk baru untuk UMKM Anda."}
            </p>
          </div>
        </div>

        <ProductForm
          umkmId={umkmId}
          legalitas={legalitas}
          product={editingProduct ?? undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </section>
    );
  }

  return (
    <ProductList
      key={refreshKey}
      umkmId={umkmId}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}
