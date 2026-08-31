"use client";

import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
  kecamatanOptions: string[];
  kategoriOptions: string[];

  kecamatan: string;
  kategori: string;
  sort: string;
  status: string;

  onStatusChange: (value: string) => void;
  onKecamatanChange: (value: string) => void;
  onKategoriChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function UmkmFilters({
  sort,
  kecamatan,
  kategori,
  status,
  kecamatanOptions,
  kategoriOptions,
  onSortChange,
  onKecamatanChange,
  onKategoriChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
      {/* Status */}
      <CustomSelect
        value={status}
        onChange={onStatusChange}
        className="w-full sm:w-40"
        placeholder="Semua Status"
        options={[
          { value: "all", label: "Semua Status" },
          { value: "public", label: "Publik" },
          { value: "private", label: "Privat" },
        ]}
      />

      {/* Sort */}
      <CustomSelect
        value={sort}
        onChange={onSortChange}
        className="w-full sm:w-40"
        placeholder="Terbaru"
        options={[
          { value: "terbaru", label: "Terbaru" },
          { value: "nama", label: "Nama A-Z" },
        ]}
      />

      {/* Kategori */}
      <CustomSelect
        value={kategori}
        onChange={onKategoriChange}
        className="w-full sm:w-44"
        placeholder="Semua Kategori"
        options={[
          { value: "all", label: "Semua Kategori" },
          ...kategoriOptions
            .filter((item) => item !== "all")
            .map((item) => ({ value: item, label: item })),
        ]}
      />

      {/* Kecamatan */}
      <CustomSelect
        value={kecamatan}
        onChange={onKecamatanChange}
        className="w-full sm:w-56"
        placeholder="Semua Kecamatan"
        options={[
          { value: "all", label: "Semua Kecamatan" },
          ...kecamatanOptions
            .filter((item) => item !== "all")
            .map((item) => ({ value: item, label: item })),
        ]}
      />
    </div>
  );
}
