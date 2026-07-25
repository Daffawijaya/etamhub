import Select from "../../Select";
import { UMKM_CATEGORIES } from "@/app/constants/umkmCategories";

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function KategoriSelect({ value, onChange, required = false, }: Props) {
  return (
    <Select
      name="kategori"
      placeholder="Pilih Kategori*"
      value={value}
      required={required}
      options={Object.keys(UMKM_CATEGORIES)}
      onChange={onChange}
    />
  );
}
