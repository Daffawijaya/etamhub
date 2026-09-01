"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import MobileFilterSheet from "@/components/ui/MobileFilterSheet";

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
  const activeCount =
    (status !== "all" ? 1 : 0) +
    (kategori !== "all" ? 1 : 0) +
    (kecamatan !== "all" ? 1 : 0) +
    (sort !== "terbaru" ? 1 : 0);

  const handleReset = () => {
    onStatusChange("all");
    onKategoriChange("all");
    onKecamatanChange("all");
    onSortChange("terbaru");
  };

  const handleApply = () => {
    // Filters are already applied live — no-op
  };

  return (
    <>
      {/* ── Desktop: inline filters ── */}
      <div className="hidden flex-wrap items-center gap-3 sm:flex">
        <CustomSelect
          value={status}
          onChange={onStatusChange}
          className="w-40"
          placeholder="Semua Status"
          options={[
            { value: "all", label: "Semua Status" },
            { value: "public", label: "Publik" },
            { value: "private", label: "Privat" },
          ]}
        />
        <CustomSelect
          value={sort}
          onChange={onSortChange}
          className="w-40"
          placeholder="Terbaru"
          options={[
            { value: "terbaru", label: "Terbaru" },
            { value: "nama", label: "Nama A-Z" },
          ]}
        />
        <CustomSelect
          value={kategori}
          onChange={onKategoriChange}
          className="w-44"
          placeholder="Semua Kategori"
          options={[
            { value: "all", label: "Semua Kategori" },
            ...kategoriOptions
              .filter((item) => item !== "all")
              .map((item) => ({ value: item, label: item })),
          ]}
        />
        <CustomSelect
          value={kecamatan}
          onChange={onKecamatanChange}
          className="w-56"
          placeholder="Semua Kecamatan"
          options={[
            { value: "all", label: "Semua Kecamatan" },
            ...kecamatanOptions
              .filter((item) => item !== "all")
              .map((item) => ({ value: item, label: item })),
          ]}
        />
      </div>

      {/* ── Mobile: bottom-sheet filter ── */}
      <MobileFilterSheet
        activeCount={activeCount}
        onReset={handleReset}
        onApply={handleApply}
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
      </MobileFilterSheet>
    </>
  );
}

/* ── Helper: labelled field wrapper for mobile sheet ── */
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
