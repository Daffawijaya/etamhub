"use client";

import Select from "../admin/Select";
import { UMKM_CATEGORIES } from "@/app/constants/umkmCategories";

interface Props {
  kategori: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function SubkategoriSelect({
  kategori,
  value,
  onChange,
  required = false,
  disabled = false,
}: Props) {
  const options = kategori
    ? [
        ...(UMKM_CATEGORIES[kategori as keyof typeof UMKM_CATEGORIES] || []),
        "Lainnya",
      ]
    : [];

  return (
    <Select
      name="subkategori"
      placeholder="Pilih Subkategori*"
      value={value}
      required={required}
      disabled={disabled || !kategori}
      options={options}
      onChange={onChange}
    />
  );
}
