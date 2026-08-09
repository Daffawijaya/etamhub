"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  CreateProductPayload,
  Product,
  ProductLegalitasJenis,
  UpdateProductPayload,
} from "@/types/product";
import { createProduct, updateProduct } from "@/lib/api/products";
import ProductBasicFields from "./ProductBasicFields";
import ProductImageUpload, {
  type ProductImageItem,
} from "./ProductImageUpload";
import ProductLegalitas, { type SelectedLegalitas } from "./ProductLegalitas";

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

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

const normalizeImages = (gambar?: string[] | null) =>
  Array.isArray(gambar)
    ? gambar.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

const normalizeKbli = (kbli?: string[] | null) =>
  Array.isArray(kbli)
    ? kbli.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

const createImageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getInitialLegalitas = (
  legalitas: UmkmLegalitas,
  product?: Product,
): SelectedLegalitas => {
  const availableKbli = normalizeKbli(legalitas.kbli);
  const selectedProductLegalitas = product?.product_legalitas ?? [];

  return {
    halal:
      selectedProductLegalitas.some((item) => item.jenis === "halal") &&
      Boolean(legalitas.halal),

    pirt:
      selectedProductLegalitas.some((item) => item.jenis === "pirt") &&
      Boolean(legalitas.pirt),

    haki:
      selectedProductLegalitas.some((item) => item.jenis === "haki") &&
      Boolean(legalitas.haki),

    kbli: selectedProductLegalitas
      .filter(
        (item) =>
          item.jenis === "kbli" &&
          typeof item.kode === "string" &&
          availableKbli.includes(item.kode),
      )
      .map((item) => item.kode as string),
  };
};

export default function ProductForm({
  umkmId,
  legalitas,
  product,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = Boolean(product);

  const initialLegalitas = useMemo(
    () => getInitialLegalitas(legalitas, product),
    [legalitas, product],
  );

  const initialImages = useMemo<ProductImageItem[]>(() => {
    return normalizeImages(product?.gambar).map((url) => ({
      id: createImageId(),
      type: "existing",
      url,
    }));
  }, [product]);

  const [nama, setNama] = useState(product?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(product?.deskripsi ?? "");
  const [harga, setHarga] = useState(formatPrice(product?.harga));
  const [satuan, setSatuan] = useState(product?.satuan ?? "");
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);

  const [selectedLegalitas, setSelectedLegalitas] =
    useState<SelectedLegalitas>(initialLegalitas);

  const [images, setImages] = useState<ProductImageItem[]>(initialImages);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNama(product?.nama ?? "");
    setDeskripsi(product?.deskripsi ?? "");
    setHarga(formatPrice(product?.harga));
    setSatuan(product?.satuan ?? "");
    setIsAvailable(product?.is_available ?? true);
    setSelectedLegalitas(getInitialLegalitas(legalitas, product));
    setImages(initialImages);
    setError("");
  }, [product, legalitas, initialImages]);

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
    setSelectedLegalitas((current) => {
      const exists = current.kbli.includes(kode);

      return {
        ...current,
        kbli: exists
          ? current.kbli.filter((item) => item !== kode)
          : [...current.kbli, kode],
      };
    });
  };

  const getLegalitasPayload = (): NonNullable<
    CreateProductPayload["legalitas"]
  > => {
    const result: NonNullable<CreateProductPayload["legalitas"]> = [];

    if (selectedLegalitas.halal && legalitas.halal) {
      result.push({
        jenis: "halal",
        kode: legalitas.halal,
      });
    }

    if (selectedLegalitas.pirt && legalitas.pirt) {
      result.push({
        jenis: "pirt",
        kode: legalitas.pirt,
      });
    }

    if (selectedLegalitas.haki && legalitas.haki) {
      result.push({
        jenis: "haki",
        kode: legalitas.haki,
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

  const getBasicPayload = () => ({
    umkm_id: umkmId,
    nama: nama.trim(),
    deskripsi: deskripsi.trim() || null,
    harga: parsePrice(harga),
    satuan: satuan.trim() || null,
    is_available: isAvailable,
    legalitas: getLegalitasPayload(),
  });

  const uploadImage = async (file: File, productId: string) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("product_id", productId);

    const response = await fetch("/api/products/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error ?? result?.message ?? "Gagal mengupload gambar produk.",
      );
    }

    if (
      !result?.success ||
      typeof result.url !== "string" ||
      !result.url.trim()
    ) {
      throw new Error("Response upload gambar tidak valid.");
    }

    return result.url;
  };

  const uploadNewImages = async (productId: string) => {
    const newImages = images.filter(
      (image): image is ProductImageItem & { file: File } =>
        image.type === "new" && image.file instanceof File,
    );

    if (newImages.length === 0) {
      return [];
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const image of newImages) {
        const url = await uploadImage(image.file, productId);
        uploadedUrls.push(url);
      }

      return uploadedUrls;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!nama.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    if (images.length > MAX_IMAGES) {
      setError(`Maksimal ${MAX_IMAGES} gambar produk.`);
      return;
    }

    setLoading(true);

    try {
      const basePayload = getBasicPayload();

      let result: Product;

      if (isEdit && product) {
        const uploadedImages = await uploadNewImages(product.id);

        const existingImages = images
          .filter((image) => image.type === "existing")
          .map((image) => image.url);

        const gambar = [...existingImages, ...uploadedImages];

        result = await updateProduct(product.id, {
          ...basePayload,
          gambar,
        } satisfies UpdateProductPayload);
      } else {
        result = await createProduct(
          basePayload satisfies CreateProductPayload,
        );

        const uploadedImages = await uploadNewImages(result.id);

        if (uploadedImages.length > 0) {
          result = await updateProduct(result.id, {
            gambar: uploadedImages,
          } satisfies UpdateProductPayload);
        }
      }

      onSuccess?.(result);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductBasicFields
        nama={nama}
        deskripsi={deskripsi}
        harga={harga}
        satuan={satuan}
        isAvailable={isAvailable}
        disabled={isSubmitting}
        onNamaChange={setNama}
        onDeskripsiChange={setDeskripsi}
        onHargaChange={setHarga}
        onSatuanChange={setSatuan}
        onAvailableChange={setIsAvailable}
      />

      <ProductImageUpload
        images={images}
        disabled={isSubmitting}
        uploading={uploading}
        error={error}
        maxImages={MAX_IMAGES}
        maxFileSize={MAX_FILE_SIZE}
        onChange={setImages}
        onError={setError}
      />

      <ProductLegalitas
        legalitas={legalitas}
        selected={selectedLegalitas}
        disabled={isSubmitting}
        onToggle={toggleLegalitas}
        onToggleKbli={toggleKbli}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
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
