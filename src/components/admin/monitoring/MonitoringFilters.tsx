"use client";

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
  const selectClass = `
    h-11
    rounded-xl
    border
    border-slate-200
    dark:border-slate-800

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
    dark:hover:border-slate-700

    focus:border-slate-400
    dark:focus:border-slate-600
  `;

  const optionClass = `
    bg-white
    dark:bg-dark
    text-slate-900
    dark:text-white
  `;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Badge */}
      <select
        value={badge}
        onChange={(e) => onBadgeChange(e.target.value)}
        className={`${selectClass} w-44`}
      >
        <option className={optionClass} value="all">
          Semua Badge
        </option>
        <option className={optionClass} value="platinum">
          💎 Naik Kelas
        </option>
        <option className={optionClass} value="gold">
          🌳 Berkembang
        </option>
        <option className={optionClass} value="silver">
          🌿 Tumbuh
        </option>
        <option className={optionClass} value="bronze">
          🌱 Pemula
        </option>
        <option className={optionClass} value="none">
          Belum Ada
        </option>
      </select>

      {/* Monitored */}
      <select
        value={monitored}
        onChange={(e) => onMonitoredChange(e.target.value)}
        className={`${selectClass} w-40`}
      >
        <option className={optionClass} value="all">
          Semua Status
        </option>
        <option className={optionClass} value="yes">
          Sudah Dipantau
        </option>
        <option className={optionClass} value="no">
          Belum Dipantau
        </option>
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className={`${selectClass} w-40`}
      >
        <option className={optionClass} value="nama">
          Nama A-Z
        </option>
        <option className={optionClass} value="monitoring">
          Jumlah Monitoring
        </option>
        <option className={optionClass} value="badge">
          Level Badge
        </option>
      </select>

      {/* Omzet Min */}
      <input
        type="number"
        placeholder="Omzet min"
        value={omzetMin}
        onChange={(e) => onOmzetMinChange(e.target.value)}
        className={`
          ${selectClass} w-36
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
          ${selectClass} w-36
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
        `}
      />

      {/* Kecamatan */}
      <select
        value={kecamatan}
        onChange={(e) => onKecamatanChange(e.target.value)}
        className={`${selectClass} w-56`}
      >
        <option className={optionClass} value="all">
          Semua Kecamatan
        </option>
        {kecamatanOptions
          .filter((item) => item !== "all")
          .map((item) => (
            <option className={optionClass} key={item} value={item}>
              {item}
            </option>
          ))}
      </select>
    </div>
  );
}
