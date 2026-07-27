import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { exportFields } from "./export-fields";

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

export async function exportUmkmExcel(selectedFields: string[]) {
  const res = await fetch("/api/umkm/export");

  const result = await res.json();
  console.log("Export API Result:", result);
  if (!res.ok) {
    throw new Error(result.message || "Gagal export data");
  }

  const rows = result.map((item: Record<string, unknown>) => {
    const row: Record<string, unknown> = {};

    exportFields.forEach((field) => {
      if (!selectedFields.includes(field.key)) {
        return;
      }

      let value = item[field.key];

      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      if (field.key === "published") {
        value = value ? "Ya" : "Tidak";
      }

      row[field.label] = value ?? "";
    });

    return row;
  });

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

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

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
