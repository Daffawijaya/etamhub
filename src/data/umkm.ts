export type Umkm = {
  id: string;

  nama: string;
  pemilik: string | null;
  kategori: string | null;
  subkategori: string | null;
  deskripsi: string | null;

  kecamatan: string | null;
  alamat: string | null;

  lat: number | null;
  lng: number | null;

  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  email: string | null;

  nik: string | null;
  nib: string | null;
  npwp: string | null;

  jenis_kelamin: string | null;

  halal: string | null;
  pirt: string | null;
  haki: string | null;

  kbli: string[] | null;
  gambar: string[] | null;

  created_at: string;
  updated_at: string | null;

  published: boolean | null;
};
