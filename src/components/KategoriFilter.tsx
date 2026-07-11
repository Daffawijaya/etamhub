"use client";

type Props = {
  kategori: string;
  setKategori: (value: string) => void;
  total: number;
};

export default function KategoriFilter({
  kategori,
  setKategori,
  total,
}: Props) {
  const categories = [
    "Semua",
    "Jasa",
    "Industri",
    "Perdagangan",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-900">
        Pilih Kategori
      </h3>

      <div className="mt-5 space-y-2">
        {categories.map((item) => {
          const active = kategori === item;

          return (
            <button
              key={item}
              onClick={() => setKategori(item)}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}