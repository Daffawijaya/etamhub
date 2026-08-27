export type Umkm = {
  id: string;

  nama: string;
  pemilik: string | null;

  kategori: string;
  subkategori: string;

  deskripsi: string | null;

  kecamatan: string;
  alamat: string | null;

  lat: number;
  lng: number;

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
  gambar: string[];

  tahun_mulai_usaha: number | null;
  jumlah_tenaga_kerja: number | null;
  omzet: number | null;

  created_at: string;
  updated_at: string | null;

  published: boolean;
};
