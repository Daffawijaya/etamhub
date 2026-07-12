"use client";

type Props = {
  kategori: string;
  setKategori: (value: string) => void;
  total: number;
  urutTerdekat: boolean;
  setUrutTerdekat: (value: boolean) => void;
};

export default function KategoriFilter({
  kategori,
  setKategori,
  total,
  urutTerdekat,
  setUrutTerdekat,
}: Props) {
  const categories = ["Semua", "Jasa", "Industri", "Perdagangan"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-900">Pilih Kategori</h3>

      <div className="mt-5 space-y-2">
        {categories.map((item) => {
          const active = kategori === item;

          return (
            <button
              key={item}
              onClick={() => setKategori(item)}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                active
                  ? "bg-primary text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <button
          onClick={() => setUrutTerdekat(!urutTerdekat)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
            urutTerdekat
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span>📍</span>
          <span>Lokasi Terdekat</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-slate-500">Total {total} UMKM</div>
    </div>
  );
}
