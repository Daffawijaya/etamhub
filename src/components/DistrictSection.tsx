import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";

export default function DistrictSection() {
  // hitung jumlah UMKM sekali saja (lebih efisien)
  const districtMap = umkms.reduce<Record<string, number>>((acc, item) => {
    acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
    return acc;
  }, {});

  const districts = Object.keys(districtMap);

  return (
    <section id="district-section" className="max-w-7xl mx-auto px-6 py-20">
      {/* header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900">Pilih Kecamatan</h2>

        <p className="mt-3 text-slate-600">
          Jelajahi UMKM berdasarkan wilayah di Kutai Kartanegara.
        </p>
      </div>

      {/* grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {districts.map((district) => {
          const totalUmkm = districtMap[district];
          const slug = slugify(district);

          return (
            <Link
              key={district}
              href={`/kecamatan/${slug}`}
              className="group rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {district
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {totalUmkm} UMKM terdaftar
                  </p>
                </div>

                {/* clean arrow icon */}
                <div className="text-slate-400 group-hover:text-violet-600 transition-all duration-300 group-hover:translate-x-1">
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
