import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";

export default function DistrictSection() {
  const districtMap = umkms.reduce<Record<string, number>>((acc, item) => {
    acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
    return acc;
  }, {});

  const districts = Object.keys(districtMap);

  return (
    <section
      id="district-section"
      className="max-w-7xl mx-auto px-6 py-28"
    >
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-5">
          Pilih Kecamatan
        </h2>

        <p className="text-lg max-w-2xl mx-auto text-slate-600 leading-relaxed">
          Jelajahi UMKM berdasarkan wilayah di Kutai Kartanegara dan temukan
          berbagai produk serta usaha lokal unggulan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {districts.map((district) => {
          const totalUmkm = districtMap[district];
          const slug = slugify(district);

          return (
            <Link
              key={district}
              href={`/kecamatan/${slug}`}
              className="
                group
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-7
                hover:border-slate-300
                hover:shadow-lg
                transition-all
                duration-300
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-3">
                    Kecamatan
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {district
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </h3>

                  <p className="mt-4 text-slate-600">
                    {totalUmkm} UMKM terdaftar
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}