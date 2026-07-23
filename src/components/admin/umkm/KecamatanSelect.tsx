"use client";

import Select from "../Select";
import { KECAMATAN_KUKAR } from "@/app/constants/kecamatanKukar";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function KecamatanSelect({ value, onChange }: Props) {
  return (
    <Select
      name="kecamatan"
      placeholder="Pilih Kecamatan"
      value={value}
      options={KECAMATAN_KUKAR}
      onChange={onChange}
    />
  );
}
