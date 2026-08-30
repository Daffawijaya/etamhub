"use client";

import CustomSelect from "@/components/ui/CustomSelect";

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
  const inputClass = `
    h-11
    rounded-xl
    border
    border-slate-200
    dark:border-white/[0.06]

    bg-slate-50
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Badge */}
      <CustomSelect
        value={badge}
        onChange={onBadgeChange}
        className="w-44"
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

      {/* Monitored */}
      <CustomSelect
        value={monitored}
        onChange={onMonitoredChange}
        className="w-40"
        placeholder="Semua Status"
        options={[
          { value: "all", label: "Semua Status" },
          { value: "yes", label: "Sudah Dimonitoring" },
          { value: "no", label: "Belum Dimonitoring" },
        ]}
      />

      {/* Sort */}
      <CustomSelect
        value={sort}
        onChange={onSortChange}
        className="w-40"
        placeholder="Nama A-Z"
        options={[
          { value: "nama", label: "Nama A-Z" },
          { value: "monitoring", label: "Jumlah Monitoring" },
          { value: "badge", label: "Level Badge" },
        ]}
      />

      {/* Omzet Min */}
      <input
        type="number"
        placeholder="Omzet min"
        value={omzetMin}
        onChange={(e) => onOmzetMinChange(e.target.value)}
        className={`
          ${inputClass} w-36
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
        `}
      />

      {/* Omzet Max */}
      <input
        type="number"
        placeholder="Omzet max"
        value={omzetMax}
        onChange={(e) => onOmzetMaxChange(e.target.value)}
        className={`
          ${inputClass} w-36
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
        `}
      />

      {/* Kecamatan */}
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
  );
}
