import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const PRODUCT_IMAGE_BUCKET = "product-images";

export const getStoragePath = (url: string) => {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
};

export async function removeProductImages(images: string[]) {
  if (images.length === 0) {
    return;
  }

  const storagePaths = images
    .map(getStoragePath)
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove(storagePaths);

  if (error) {
    console.error("Remove old product images error:", error);
  }
}
