export interface UmkmFormData {
  nama: string;
  pemilik: string;

  kategori: string;
  subkategori: string;

  deskripsi: string;

  kecamatan: string;
  alamat: string;

  lat: string;
  lng: string;

  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;

  nik: string;
  jenis_kelamin: string;
  email: string;

  nib: string;
  kbli: string;
  npwp: string;
  halal: string;
  pirt: string;
  haki: string;

  published: boolean;
}

export type ImageItem = {
  type: "old" | "new";
  url: string;
  file?: File;
};
