"use client";

import Select from "../Select";
import { UMKM_CATEGORIES } from "@/app/constants/umkmCategories";

interface Props {
  kategori: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SubkategoriSelect({
  kategori,
  value,
  onChange,
}: Props) {
  const options = kategori
    ? [
        ...(UMKM_CATEGORIES[
          kategori as keyof typeof UMKM_CATEGORIES
        ] || []),
        "Lainnya",
      ]
    : [];

  return (
    <Select
      name="subkategori"
      placeholder="Pilih Subkategori"
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}