"use client";

import { ChangeEvent } from "react";

export type ProductImageItem = {
  id: string;
  type: "existing" | "new";
  url: string;
  file?: File;
};

type ProductImageUploadProps = {
  images: ProductImageItem[];
  disabled?: boolean;
  uploading?: boolean;
  error?: string;
  maxImages?: number;
  maxFileSize?: number;
  onChange: (images: ProductImageItem[]) => void;
  onError?: (message: string) => void;
};

const DEFAULT_MAX_IMAGES = 5;
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const createImageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ProductImageUpload({
  images,
  disabled = false,
  uploading = false,
  error,
  maxImages = DEFAULT_MAX_IMAGES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  onChange,
  onError,
}: ProductImageUploadProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    onError?.("");

    const availableSlots = maxImages - images.length;

    if (availableSlots <= 0) {
      onError?.(`Maksimal ${maxImages} gambar produk.`);
      return;
    }

    if (files.length > availableSlots) {
      onError?.(
        `Maksimal ${maxImages} gambar produk. Anda hanya dapat menambahkan ${availableSlots} gambar lagi.`,
      );
      return;
    }

    const newImages: ProductImageItem[] = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        onError?.("Format gambar hanya boleh JPG, PNG, atau WEBP.");
        return;
      }

      if (file.size > maxFileSize) {
        onError?.(
          `Ukuran setiap gambar maksimal ${Math.round(
            maxFileSize / (1024 * 1024),
          )} MB.`,
        );
        return;
      }

      newImages.push({
        id: createImageId(),
        type: "new",
        url: URL.createObjectURL(file),
        file,
      });
    }

    onChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const image = images.find((item) => item.id === id);

    if (image?.type === "new") {
      URL.revokeObjectURL(image.url);
    }

    onChange(images.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Gambar Produk
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Maksimal {maxImages} gambar. JPG, PNG, atau WEBP dengan ukuran
          maksimal {Math.round(maxFileSize / (1024 * 1024))} MB per gambar.
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

              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100"
                >
                  Hapus
                </button>
              )}

              {image.type === "new" && (
                <span className="absolute bottom-2 left-2 rounded-md bg-green-600 px-2 py-1 text-[10px] font-medium text-white">
                  Baru
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <label
          htmlFor="product-images"
          className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition dark:border-gray-700 dark:bg-gray-900/50 ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:border-green-500 dark:hover:bg-green-950/20"
          }`}
        >
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {uploading ? "Mengupload gambar..." : "Tambahkan gambar"}
          </span>

          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {images.length}/{maxImages} gambar
          </span>

          <input
            id="product-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
