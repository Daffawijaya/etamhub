import Select from "../Select";
import { UMKM_CATEGORIES } from "@/app/constants/umkmCategories";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function KategoriSelect({ value, onChange }: Props) {
  return (
    <Select
      name="kategori"
      placeholder="Pilih Kategori"
      value={value}
      options={Object.keys(UMKM_CATEGORIES)}
      onChange={onChange}
    />
  );
}
