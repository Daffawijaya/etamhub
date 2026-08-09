export type ProductLegalitasJenis = "halal" | "pirt" | "haki" | "kbli";

export interface ProductLegalitas {
  id: string;
  product_id: string;
  jenis: ProductLegalitasJenis;
  kode: string | null;
  created_at: string;
}

export interface ProductUmkm {
  id: string;
  nama: string;
  owner_id: string | null;
}

export interface Product {
  id: string;
  umkm_id: string;
  nama: string;
  deskripsi: string | null;
  harga: number | null;
  satuan: string | null;
  gambar: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
  umkm?: ProductUmkm | null;
  product_legalitas: ProductLegalitas[];
}

export interface ProductLegalitasInput {
  jenis: ProductLegalitasJenis;
  kode?: string | null;
}

export interface CreateProductPayload {
  umkm_id: string;
  nama: string;
  deskripsi?: string | null;
  harga?: number | null;
  satuan?: string | null;
  gambar?: string[];
  is_available?: boolean;
  legalitas?: ProductLegalitasInput[];
}

export interface UpdateProductPayload {
  umkm_id?: string;
  nama?: string;
  deskripsi?: string | null;
  harga?: number | null;
  satuan?: string | null;
  gambar?: string[];
  is_available?: boolean;
  legalitas?: ProductLegalitasInput[];
}
