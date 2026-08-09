import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product";

type ProductsResponse = {
  success: boolean;
  data: Product[];
  message?: string;
};

type ProductResponse = {
  success: boolean;
  data: Product;
  message?: string;
};

type DeleteProductResponse = {
  success: boolean;
  message: string;
};

export async function getProducts(params?: {
  umkmId?: string;
  search?: string;
  available?: boolean;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams();

  if (params?.umkmId) {
    searchParams.set("umkm_id", params.umkmId);
  }

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params?.available !== undefined) {
    searchParams.set("available", String(params.available));
  }

  const query = searchParams.toString();

  const response = await fetch(`/api/products${query ? `?${query}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });

  const result: ProductsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil data produk");
  }

  return result.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const result: ProductResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil data produk");
  }

  return result.data;
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ProductResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal menambahkan produk");
  }

  return result.data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ProductResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal memperbarui produk");
  }

  return result.data;
}

export async function deleteProduct(
  id: string,
): Promise<DeleteProductResponse> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  const result: DeleteProductResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal menghapus produk");
  }

  return result;
}
