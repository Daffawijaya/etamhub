"use client";

interface Props {
  sort: string;
  kecamatan: string;
  kecamatanOptions: string[];

  onSortChange: (value: string) => void;
  onKecamatanChange: (value: string) => void;
}

export default function UmkmFilters({
  sort,
  kecamatan,
  kecamatanOptions,
  onSortChange,
  onKecamatanChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
      >
        <option value="nama">Nama A-Z</option>
        <option value="terbaru">Terbaru</option>
      </select>

      <select
        value={kecamatan}
        onChange={(e) => onKecamatanChange(e.target.value)}
        className="h-11 w-56 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
      >
        <option value="all">Semua Kecamatan</option>

        {kecamatanOptions
          .filter((item) => item !== "all")
          .map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
      </select>
    </div>
  );
}