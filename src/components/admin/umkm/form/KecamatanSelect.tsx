"use client";

import Select from "../../Select";

interface Props {
  value: string;
  options?: string[];
  required?: boolean;
  onChange: (value: string) => void;
}

export default function KecamatanSelect({
  value,
  options,
  onChange,
  required = false,
}: Props) {
  return (
    <Select
      name="kecamatan"
      placeholder="Pilih Kecamatan*"
      value={value}
      options={options ?? []}
      required={required}
      onChange={onChange}
    />
  );
}
