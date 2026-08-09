"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  CreateProductPayload,
  Product,
  ProductLegalitasJenis,
  UpdateProductPayload,
} from "@/types/product";
import { createProduct, updateProduct } from "@/lib/api/products";
import { useProductImages } from "./hooks/useProductImages";

type UmkmLegalitas = {
  halal?: string | null;
  pirt?: string | null;
  haki?: string | null;
  kbli?: string[] | null;
};

type Props = {
  umkmId: string;
  legalitas: UmkmLegalitas;
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
};

type SelectedLegalitas = {
  halal: boolean;
  pirt: boolean;
  haki: boolean;
  kbli: string[];
};

const formatPrice = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("id-ID").format(value);
};

const parsePrice = (value: string) => {
  const normalized = value.replace(/\D/g, "");

  return normalized ? Number(normalized) : null;
};

const normalizeKbli = (kbli?: string[] | null) =>
  Array.isArray(kbli)
    ? kbli.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

export default function ProductForm({
  umkmId,
  legalitas,
  product,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = Boolean(product);

  const availableKbli = useMemo(
    () => normalizeKbli(legalitas.kbli),
    [legalitas.kbli],
  );

  const initialLegalitas = useMemo<SelectedLegalitas>(() => {
    const selected = product?.product_legalitas ?? [];

    return {
      halal: selected.some((item) => item.jenis === "halal"),
      pirt: selected.some((item) => item.jenis === "pirt"),
      haki: selected.some((item) => item.jenis === "haki"),
      kbli: selected
        .filter((item) => item.jenis === "kbli" && item.kode)
        .map((item) => item.kode as string),
    };
  }, [product]);

  const [nama, setNama] = useState(product?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(product?.deskripsi ?? "");
  const [harga, setHarga] = useState(formatPrice(product?.harga));
  const [satuan, setSatuan] = useState(product?.satuan ?? "");
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [selectedLegalitas, setSelectedLegalitas] =
    useState<SelectedLegalitas>(initialLegalitas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    images,
    uploading,
    error: imageError,
    maxImages,
    handleImageChange,
    removeImage,
    uploadNewImages,
    getExistingImages,
  } = useProductImages({
    initialImages: product?.gambar,
  });

  const hasHalal = Boolean(legalitas.halal);
  const hasPirt = Boolean(legalitas.pirt);
  const hasHaki = Boolean(legalitas.haki);

  const toggleLegalitas = (jenis: ProductLegalitasJenis) => {
    setSelectedLegalitas((current) => {
      if (jenis === "halal") {
        return {
          ...current,
          halal: !current.halal,
        };
      }

      if (jenis === "pirt") {
        return {
          ...current,
          pirt: !current.pirt,
        };
      }

      if (jenis === "haki") {
        return {
          ...current,
          haki: !current.haki,
        };
      }

      return current;
    });
  };

  const toggleKbli = (kode: string) => {
    setSelectedLegalitas((current) => ({
      ...current,
      kbli: current.kbli.includes(kode)
        ? current.kbli.filter((item) => item !== kode)
        : [...current.kbli, kode],
    }));
  };

  const getLegalitasPayload = (): NonNullable<
    CreateProductPayload["legalitas"]
  > => {
    const result: NonNullable<CreateProductPayload["legalitas"]> = [];

    if (selectedLegalitas.halal && hasHalal) {
      result.push({
        jenis: "halal",
        kode: null,
      });
    }

    if (selectedLegalitas.pirt && hasPirt) {
      result.push({
        jenis: "pirt",
        kode: null,
      });
    }

    if (selectedLegalitas.haki && hasHaki) {
      result.push({
        jenis: "haki",
        kode: null,
      });
    }

    selectedLegalitas.kbli.forEach((kode) => {
      result.push({
        jenis: "kbli",
        kode,
      });
    });

    return result;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!nama.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    if (images.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar produk.`);
      return;
    }

    setLoading(true);

    try {
      let productResult: Product;

      if (isEdit && product) {
        const existingImages = getExistingImages();

        const payload = {
          umkm_id: umkmId,
          nama: nama.trim(),
          deskripsi: deskripsi.trim() || null,
          harga: parsePrice(harga),
          satuan: satuan.trim() || null,
          gambar: existingImages,
          is_available: isAvailable,
          legalitas: getLegalitasPayload(),
        } satisfies UpdateProductPayload;

        productResult = await updateProduct(product.id, payload);

        const uploadedImages = await uploadNewImages(productResult.id);

        if (uploadedImages.length > 0) {
          const finalImages = [...existingImages, ...uploadedImages];

          productResult = await updateProduct(productResult.id, {
            gambar: finalImages,
          } satisfies UpdateProductPayload);
        }
      } else {
        const payload = {
          umkm_id: umkmId,
          nama: nama.trim(),
          deskripsi: deskripsi.trim() || null,
          harga: parsePrice(harga),
          satuan: satuan.trim() || null,
          gambar: [],
          is_available: isAvailable,
          legalitas: getLegalitasPayload(),
        } satisfies CreateProductPayload;

        productResult = await createProduct(payload);

        const uploadedImages = await uploadNewImages(productResult.id);

        if (uploadedImages.length > 0) {
          productResult = await updateProduct(productResult.id, {
            gambar: uploadedImages,
          } satisfies UpdateProductPayload);
        }
      }

      onSuccess?.(productResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan produk.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || uploading;
  const displayError = error || imageError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="product-name"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Nama Produk
        </label>

        <input
          id="product-name"
          type="text"
          value={nama}
          onChange={(event) => setNama(event.target.value)}
          placeholder="Masukkan nama produk"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="product-description"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Deskripsi
        </label>

        <textarea
          id="product-description"
          value={deskripsi}
          onChange={(event) => setDeskripsi(event.target.value)}
          placeholder="Masukkan deskripsi produk"
          rows={4}
          disabled={isSubmitting}
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Gambar Produk
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Maksimal {maxImages} gambar. JPG, PNG, atau WEBP dengan ukuran
            maksimal 5 MB per gambar.
          </p>
        </div>

        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <img
                  src={image.url}
                  alt="Preview produk"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  disabled={isSubmitting}
                  className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < maxImages && (
          <label
            htmlFor="product-images"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-green-500 dark:hover:bg-green-950/20"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Tambahkan gambar
            </span>

            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {images.length}/{maxImages} gambar
            </span>

            <input
              id="product-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="product-price"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Harga
          </label>

          <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900">
            <span className="flex items-center border-r border-gray-300 px-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Rp
            </span>

            <input
              id="product-price"
              type="text"
              inputMode="numeric"
              value={harga}
              onChange={(event) =>
                setHarga(
                  event.target.value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                )
              }
              placeholder="0"
              disabled={isSubmitting}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="product-unit"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Satuan
          </label>

          <input
            id="product-unit"
            type="text"
            value={satuan}
            onChange={(event) => setSatuan(event.target.value)}
            placeholder="Contoh: pcs, kg, botol, pack"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Legalitas Produk
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Pilih legalitas yang berlaku untuk produk ini.
          </p>
        </div>

        <div className="space-y-3">
          {hasHalal && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <input
                type="checkbox"
                checked={selectedLegalitas.halal}
                onChange={() => toggleLegalitas("halal")}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />

              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Halal
              </span>
            </label>
          )}

          {hasPirt && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <input
                type="checkbox"
                checked={selectedLegalitas.pirt}
                onChange={() => toggleLegalitas("pirt")}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />

              <span className="text-sm font-medium text-gray-900 dark:text-white">
                PIRT
              </span>
            </label>
          )}

          {hasHaki && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <input
                type="checkbox"
                checked={selectedLegalitas.haki}
                onChange={() => toggleLegalitas("haki")}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />

              <span className="text-sm font-medium text-gray-900 dark:text-white">
                HAKI
              </span>
            </label>
          )}

          {availableKbli.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                KBLI
              </p>

              <div className="space-y-2">
                {availableKbli.map((kode) => (
                  <label
                    key={kode}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLegalitas.kbli.includes(kode)}
                      onChange={() => toggleKbli(kode)}
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {kode}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!hasHalal && !hasPirt && !hasHaki && availableKbli.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              UMKM belum memiliki legalitas yang dapat digunakan untuk produk.
            </div>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />

        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Produk tersedia
        </span>
      </label>

      {displayError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {displayError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Batal
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Mengupload gambar..."
            : loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
}
