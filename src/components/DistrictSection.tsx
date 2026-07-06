import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";

export default function DistrictSection() {
  const districtMap = umkms.reduce<Record<string, number>>((acc, item) => {
    acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
    return acc;
  }, {});

  const districts = Object.keys(districtMap);

  // 20 warna pastel / cerah
  const cardColors = [
    "bg-red-100 hover:bg-red-200",
    "bg-orange-100 hover:bg-orange-200",
    "bg-amber-100 hover:bg-amber-200",
    "bg-yellow-100 hover:bg-yellow-200",
    "bg-lime-100 hover:bg-lime-200",
    "bg-green-100 hover:bg-green-200",
    "bg-emerald-100 hover:bg-emerald-200",
    "bg-teal-100 hover:bg-teal-200",
    "bg-cyan-100 hover:bg-cyan-200",
    "bg-sky-100 hover:bg-sky-200",
    "bg-blue-100 hover:bg-blue-200",
    "bg-indigo-100 hover:bg-indigo-200",
    "bg-violet-100 hover:bg-violet-200",
    "bg-purple-100 hover:bg-purple-200",
    "bg-fuchsia-100 hover:bg-fuchsia-200",
    "bg-pink-100 hover:bg-pink-200",
    "bg-rose-100 hover:bg-rose-200",
    "bg-stone-100 hover:bg-stone-200",
    "bg-slate-100 hover:bg-slate-200",
    "bg-zinc-100 hover:bg-zinc-200",
  ];

  return (
    <section id="district-section" className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900">Pilih Kecamatan</h2>

        <p className="mt-3 text-slate-600">
          Jelajahi UMKM berdasarkan wilayah di Kutai Kartanegara.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {districts.map((district, index) => {
          const totalUmkm = districtMap[district];
          const slug = slugify(district);

          const colorClass = cardColors[index % cardColors.length];

          return (
            <Link
              key={district}
              href={`/kecamatan/${slug}`}
              className={`group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 ${colorClass}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {district
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {totalUmkm} UMKM terdaftar
                  </p>
                </div>

                <div className="text-slate-500 transition-all duration-300 group-hover:translate-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
