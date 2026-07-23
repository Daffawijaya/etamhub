"use client";

interface Props {
  sort: string;
  kecamatan: string;
  kategori: string;
  kecamatanOptions: string[];

  onSortChange: (value: string) => void;
  onKecamatanChange: (value: string) => void;
  onKategoriChange: (value: string) => void;
}

export default function UmkmFilters({
  sort,
  kecamatan,
  kategori,
  kecamatanOptions,
  onSortChange,
  onKecamatanChange,
  onKategoriChange,
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
      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className={`${selectClass} w-40`}
      >
        <option className={optionClass} value="nama">
          Nama A-Z
        </option>

        <option className={optionClass} value="terbaru">
          Terbaru
        </option>
      </select>

      {/* Kategori */}
      <select
        value={kategori}
        onChange={(e) => onKategoriChange(e.target.value)}
        className={`${selectClass} w-44`}
      >
        <option className={optionClass} value="all">
          Semua Kategori
        </option>

        <option className={optionClass} value="Jasa">
          Jasa
        </option>

        <option className={optionClass} value="Perdagangan">
          Perdagangan
        </option>

        <option className={optionClass} value="Industri">
          Industri
        </option>
      </select>

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
