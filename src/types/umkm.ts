export type Umkm = {
  id: number;
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
};