"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import FilterSheet from "@/components/ui/FilterSheet";

interface Props {
  kecamatanOptions: string[];
  badge: string;
  monitored: string;
  omzetMin: string;
  omzetMax: string;
  kecamatan: string;
  sort: string;
  onBadgeChange: (value: string) => void;
  onMonitoredChange: (value: string) => void;
  onOmzetMinChange: (value: string) => void;
  onOmzetMaxChange: (value: string) => void;
  onKecamatanChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  dark:border-white/[0.06]
  bg-white
  dark:bg-dark
  px-3
  text-sm
  font-medium
  text-slate-700
  dark:text-white
  outline-none
  transition-all
  duration-300
  hover:border-slate-300
  dark:hover:border-white/[0.12]
  focus:border-sky-500
  focus:ring-4
  focus:ring-sky-500/10
`;

export default function MonitoringFilters({
  badge,
  monitored,
  omzetMin,
  omzetMax,
  kecamatan,
  sort,
  kecamatanOptions,
  onBadgeChange,
  onMonitoredChange,
  onOmzetMinChange,
  onOmzetMaxChange,
  onKecamatanChange,
  onSortChange,
}: Props) {
  const activeCount =
    (badge !== "all" ? 1 : 0) +
    (monitored !== "all" ? 1 : 0) +
    (sort !== "terbaru" ? 1 : 0) +
    (kecamatan !== "all" ? 1 : 0) +
    (omzetMin ? 1 : 0) +
    (omzetMax ? 1 : 0);

  const handleReset = () => {
    onBadgeChange("all");
    onMonitoredChange("all");
    onSortChange("terbaru");
    onKecamatanChange("all");
    onOmzetMinChange("");
    onOmzetMaxChange("");
  };

  const handleApply = () => {
    // Filters are already applied live — no-op
  };

  return (
    <div className="relative">
      <FilterSheet
        activeCount={activeCount}
        onReset={handleReset}
        onApply={handleApply}
      >
        <FilterField label="Badge">
          <CustomSelect
            value={badge}
            onChange={onBadgeChange}
            placeholder="Semua Badge"
            options={[
              { value: "all", label: "Semua Badge" },
              { value: "platinum", label: "Naik Kelas" },
              { value: "gold", label: "Berkembang" },
              { value: "silver", label: "Tumbuh" },
              { value: "bronze", label: "Pemula" },
              { value: "none", label: "Belum Ada" },
            ]}
          />
        </FilterField>

        <FilterField label="Status Monitoring">
          <CustomSelect
            value={monitored}
            onChange={onMonitoredChange}
            placeholder="Semua Status"
            options={[
              { value: "all", label: "Semua Status" },
              { value: "yes", label: "Sudah Dimonitoring" },
              { value: "no", label: "Belum Dimonitoring" },
            ]}
          />
        </FilterField>

        <FilterField label="Urutkan">
          <CustomSelect
            value={sort}
            onChange={onSortChange}
            placeholder="Data Terbaru"
            options={[
              { value: "terbaru", label: "Data Terbaru" },
              { value: "lama", label: "Data Terlama" },
              { value: "nama", label: "Nama A-Z" },
              { value: "monitoring", label: "Jumlah Monitoring" },
              { value: "badge", label: "Level Badge" },
            ]}
          />
        </FilterField>

        <FilterField label="Omzet">
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              value={omzetMin}
              onChange={(e) => onOmzetMinChange(e.target.value)}
              className={`${inputClass} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
            />
            <input
              type="number"
              placeholder="Max"
              value={omzetMax}
              onChange={(e) => onOmzetMaxChange(e.target.value)}
              className={`${inputClass} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
            />
          </div>
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
