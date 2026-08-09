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
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Gambar Produk
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-500">
          Maksimal {maxImages} gambar. JPG, PNG, atau WEBP dengan ukuran
          maksimal {Math.round(maxFileSize / (1024 * 1024))} MB per gambar.
        </p>
      </div>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-[#202020]"
            >
              <img
                src={image.url}
                alt="Preview produk"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                {image.type === "new" ? (
                  <span className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-medium text-white dark:bg-emerald-500 dark:text-emerald-950">
                    Baru
                  </span>
                ) : (
                  <span />
                )}

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <label
          htmlFor="product-images"
          className={`flex min-h-32 flex-col items-center justify-center rounded-lg bg-zinc-50 px-4 py-7 text-center transition-all duration-200 dark:bg-[#202020] ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#242424]"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
            {uploading ? "Mengupload gambar..." : "Tambahkan gambar"}
          </span>

          <span className="mt-1 text-xs text-gray-500 dark:text-gray-500">
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
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
