import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";

export default function DistrictSection() {
  const districtMap = umkms.reduce<Record<string, number>>((acc, item) => {
    acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
    return acc;
  }, {});

  const districts = Object.keys(districtMap).sort((a, b) =>
    a.localeCompare(b, "id", { sensitivity: "base" }),
  );

  return (
    <section
      id="district-section"
      className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-24 lg:py-28"
    >
      <div className="mb-10 md:mb-14 lg:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-5">
          Pilih Kecamatan
        </h2>

        <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600 leading-relaxed">
          Jelajahi UMKM berdasarkan wilayah di Kutai Kartanegara dan temukan
          berbagai produk serta usaha lokal unggulan.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                p-5 md:p-6 lg:p-7
                hover:border-slate-300
                hover:shadow-lg
                transition-all
                duration-300
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 mb-2 md:mb-3">
                    Kecamatan
                  </p>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 break-words">
                    {district
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                  </h3>

                  <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
                    {totalUmkm} UMKM terdaftar
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-9 h-9
                    md:w-10 md:h-10
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    shrink-0
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