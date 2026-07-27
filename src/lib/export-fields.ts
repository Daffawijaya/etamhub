export type ExportField = {
  key: string;
  label: string;
};

export type ExportGroup = {
  title: string;
  fields: ExportField[];
};

export const exportGroups: ExportGroup[] = [
  {
    title: "Informasi UMKM",
    fields: [
      { key: "nama", label: "Nama UMKM" },
      { key: "pemilik", label: "Pemilik" },
      { key: "kategori", label: "Kategori" },
      { key: "subkategori", label: "Subkategori" },
      { key: "deskripsi", label: "Deskripsi usaha" },
    ],
  },

  {
    title: "Lokasi",
    fields: [
      { key: "kecamatan", label: "Kecamatan" },
      { key: "alamat", label: "Alamat lengkap" },
      { key: "lat", label: "Latitude" },
      { key: "lng", label: "Longitude" },
    ],
  },

  {
    title: "Kontak",
    fields: [
      { key: "whatsapp", label: "WhatsApp" },
      { key: "email", label: "Email" },
      { key: "instagram", label: "Instagram" },
      { key: "facebook", label: "Facebook" },
      { key: "tiktok", label: "TikTok" },
    ],
  },

  {
    title: "Legalitas",
    fields: [
      { key: "nik", label: "NIK" },
      { key: "nib", label: "NIB" },
      { key: "npwp", label: "NPWP" },
      { key: "halal", label: "Sertifikat Halal" },
      { key: "pirt", label: "PIRT" },
      { key: "haki", label: "HAKI" },
      { key: "kbli", label: "KBLI" },
    ],
  },

  {
    title: "Media",
    fields: [
      {
        key: "gambar",
        label: "Foto usaha/produk",
      },
    ],
  },

  {
    title: "Sistem",
    fields: [
      {
        key: "published",
        label: "Dipublikasikan",
      },
      {
        key: "created_at",
        label: "Tanggal dibuat",
      },
      {
        key: "updated_at",
        label: "Tanggal diperbarui",
      },
    ],
  },
];

export const exportFields = exportGroups.flatMap((group) => group.fields);
