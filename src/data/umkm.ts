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
  whatsapp?: string | number;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  createdAt?: string;
  updatedAt?: string;
};
