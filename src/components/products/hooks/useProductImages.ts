"use client";

import { useEffect, useState } from "react";

export type ProductImageItem = {
  id: string;
  type: "existing" | "new";
  url: string;
  file?: File;
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const normalizeImages = (gambar?: string[] | null): string[] =>
  Array.isArray(gambar)
    ? gambar.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

const createImageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type UseProductImagesProps = {
  initialImages?: string[] | null;
};

export function useProductImages({
  initialImages,
}: UseProductImagesProps = {}) {
  const [images, setImages] = useState<ProductImageItem[]>(() =>
    normalizeImages(initialImages).map((url) => ({
      id: createImageId(),
      type: "existing",
      url,
    })),
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.type === "new") {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setError("");

    const availableSlots = MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      setError(`Maksimal ${MAX_IMAGES} gambar produk.`);
      event.target.value = "";
      return;
    }

    if (files.length > availableSlots) {
      setError(`Maksimal ${MAX_IMAGES} gambar produk.`);
      event.target.value = "";
      return;
    }

    const newImages: ProductImageItem[] = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        setError("Format gambar hanya boleh JPG, PNG, atau WEBP.");
        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Ukuran setiap gambar maksimal 5 MB.");
        event.target.value = "";
        return;
      }

      newImages.push({
        id: createImageId(),
        type: "new",
        url: URL.createObjectURL(file),
        file,
      });
    }

    setImages((current) => [...current, ...newImages]);

    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image?.type === "new") {
        URL.revokeObjectURL(image.url);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const uploadNewImages = async (productId: string): Promise<string[]> => {
    const newImages = images.filter(
      (image): image is ProductImageItem & { file: File } =>
        image.type === "new" && image.file instanceof File,
    );

    if (newImages.length === 0) {
      return [];
    }

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const image of newImages) {
        const formData = new FormData();

        formData.append("file", image.file);
        formData.append("product_id", productId);

        const response = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ??
              result?.message ??
              "Gagal mengupload gambar produk.",
          );
        }

        if (
          !result?.success ||
          typeof result?.url !== "string" ||
          !result.url.trim()
        ) {
          throw new Error("Response upload gambar tidak valid.");
        }

        uploadedUrls.push(result.url);
      }

      return uploadedUrls;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengupload gambar produk.";

      setError(message);

      throw error;
    } finally {
      setUploading(false);
    }
  };

  const getExistingImages = () =>
    images
      .filter((image) => image.type === "existing")
      .map((image) => image.url);

  const getNewImageCount = () =>
    images.filter((image) => image.type === "new").length;

  const getImageCount = () => images.length;

  const resetImages = () => {
    images.forEach((image) => {
      if (image.type === "new") {
        URL.revokeObjectURL(image.url);
      }
    });

    setImages([]);
    setError("");
  };

  return {
    images,
    uploading,
    error,
    maxImages: MAX_IMAGES,
    maxFileSize: MAX_FILE_SIZE,
    handleImageChange,
    removeImage,
    uploadNewImages,
    getExistingImages,
    getNewImageCount,
    getImageCount,
    resetImages,
    setError,
  };
}
