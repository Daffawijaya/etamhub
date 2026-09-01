"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import FilterSheet from "@/components/ui/FilterSheet";

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
  onApply?: () => void;
  onReset?: () => void;
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
  onApply,
  onReset,
}: Props) {
  const activeCount =
    (status !== "all" ? 1 : 0) +
    (kategori !== "all" ? 1 : 0) +
    (kecamatan !== "all" ? 1 : 0) +
    (sort !== "terbaru" ? 1 : 0);

  const handleReset = () => {
    onReset?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  return (
    <div className="relative">
      <FilterSheet
        activeCount={activeCount}
        onReset={handleReset}
        onApply={handleApply}
        discardOnClose
      >
        <FilterField label="Status">
          <CustomSelect
            value={status}
            onChange={onStatusChange}
            placeholder="Semua Status"
            options={[
              { value: "all", label: "Semua Status" },
              { value: "public", label: "Publik" },
              { value: "private", label: "Privat" },
            ]}
          />
        </FilterField>

        <FilterField label="Urutkan">
          <CustomSelect
            value={sort}
            onChange={onSortChange}
            placeholder="Terbaru"
            options={[
              { value: "terbaru", label: "Terbaru" },
              { value: "nama", label: "Nama A-Z" },
            ]}
          />
        </FilterField>

        <FilterField label="Kategori">
          <CustomSelect
            value={kategori}
            onChange={onKategoriChange}
            placeholder="Semua Kategori"
            options={[
              { value: "all", label: "Semua Kategori" },
              ...kategoriOptions
                .filter((item) => item !== "all")
                .map((item) => ({ value: item, label: item })),
            ]}
          />
        </FilterField>

        <FilterField label="Kecamatan">
          <CustomSelect
            value={kecamatan}
            onChange={onKecamatanChange}
            placeholder="Semua Kecamatan"
            options={[
              { value: "all", label: "Semua Kecamatan" },
              ...kecamatanOptions
                .filter((item) => item !== "all")
                .map((item) => ({ value: item, label: item })),
            ]}
          />
        </FilterField>
      </FilterSheet>
    </div>
  );
}

/* ── Helper: labelled field wrapper ── */
function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}
