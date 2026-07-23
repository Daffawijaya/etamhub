export type Umkm = {
  id: string;
  nama: string;
  pemilik: string;
  kategori: string;
  subkategori: string;
  deskripsi: string;
  gambar: string[];
  kecamatan: string;
  alamat: string;
  lat: number;
  lng: number;

  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;

  created_at: string;
  updated_at: string;
};