"use client";

import CustomSelect from "@/components/ui/CustomSelect";

interface SelectProps {
  name: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function Select({
  name,
  value,
  options,
  placeholder,
  required = false,
  onChange,
}: SelectProps) {
  const sortedOptions = [...options].sort((a, b) => {
    if (a === "Lainnya") return 1;
    if (b === "Lainnya") return -1;
    return a.localeCompare(b, "id");
  });

  const mappedOptions = sortedOptions.map((opt) => ({
    value: opt,
    label: opt,
  }));

  return (
    <CustomSelect
      name={name}
      value={value}
      onChange={onChange}
      options={mappedOptions}
      placeholder={placeholder ?? `Pilih ${name}`}
      required={required}
    />
  );
}
