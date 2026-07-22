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
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-slate-400"
      >
        <option value="nama">Nama A-Z</option>
        <option value="terbaru">Terbaru</option>
      </select>

      {/* Kategori */}
      <select
        value={kategori}
        onChange={(e) => onKategoriChange(e.target.value)}
        className="h-11 w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-slate-400"
      >
        <option value="all">Semua Kategori</option>
        <option value="Jasa">Jasa</option>
        <option value="Perdagangan">Perdagangan</option>
        <option value="Industri">Industri</option>
      </select>

      {/* Kecamatan */}
      <select
        value={kecamatan}
        onChange={(e) => onKecamatanChange(e.target.value)}
        className="h-11 w-56 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-slate-400"
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
