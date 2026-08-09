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
    console.log("USER PRODUCTS LEGALITAS:", legalitas);
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
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingProduct ? "Edit Produk" : "Tambah Produk"}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {editingProduct
              ? "Perbarui informasi produk dan legalitasnya."
              : "Tambahkan produk baru untuk UMKM Anda."}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <ProductForm
            umkmId={umkmId}
            legalitas={legalitas}
            product={editingProduct ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
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
