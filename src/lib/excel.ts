import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const excelHeaders = [
  "Nama UMKM",
  "Pemilik",
  "Kategori",
  "Subkategori",
  "Deskripsi usaha",
  "Foto usaha/produk",
  "Kecamatan",
  "Alamat lengkap",
  "Latitude",
  "Longitude",
  "whatsapp",
  "instagram",
  "facebook url",
  "tiktok",
];

export function downloadUmkmTemplate() {
  const worksheet = XLSX.utils.json_to_sheet([], {
    header: excelHeaders,
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Template UMKM");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([buffer]), "template-import-umkm.xlsx");
}

export async function exportUmkmExcel() {
  const res = await fetch("/api/umkm");

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal export data");
  }

  const rows = result.map((item: any) => ({
    "Nama UMKM": item.nama,
    Pemilik: item.pemilik,
    Kategori: item.kategori,
    Subkategori: item.subkategori ?? "",
    "Deskripsi usaha": item.deskripsi,
    "Foto usaha/produk": Array.isArray(item.gambar)
      ? item.gambar.join(", ")
      : (item.gambar ?? ""),
    Kecamatan: item.kecamatan,
    "Alamat lengkap": item.alamat,
    Latitude: item.lat,
    Longitude: item.lng,
    whatsapp: item.whatsapp,
    instagram: item.instagram,
    "facebook url": item.facebook,
    tiktok: item.tiktok,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "UMKM");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([buffer]), "data-umkm.xlsx");
}

export async function importUmkmExcel(file: File) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  if (rows.length === 0) {
    throw new Error("File Excel tidak memiliki data.");
  }

  const res = await fetch("/api/umkm/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rows),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal import data");
  }

  return result;
}
