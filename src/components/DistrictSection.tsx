import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";
import SectionHeader from "./textBlock/SectionHeader";
import BottomGlow from "./decoration/BottomGlow";

export default function DistrictSection() {
  const districtMap = umkms.reduce<Record<string, number>>((acc, item) => {
    acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
    return acc;
  }, {});

  const districts = Object.keys(districtMap).sort((a, b) =>
    a.localeCompare(b, "id", { sensitivity: "base" }),
  );

  return (
    <section className="relative overflow-hidden bg-dark py-24 md:py-32">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-purple-700/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[200px]" />
      </div>

      <BottomGlow />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <SectionHeader
            title="Pilih Kecamatan"
            description="Telusuri data UMKM Kutai Kartanegara berdasarkan kecamatan dan
            temukan berbagai usaha lokal yang telah terdaftar dalam sistem."
          />
        </div>

        {/* Grid */}
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
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#161616]
                  p-6
                  md:p-7
                  transition-all
                  duration-300
                  hover:border-white/20
                  hover:bg-[#1a1a1a]
                  hover:-translate-y-1
                "
              >
                {/* Hover Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                    bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_50%)]
                  "
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-500 mb-3">Kecamatan</p>

                    <h3
                      className="
                        text-xl
                        md:text-2xl
                        font-medium
                        text-white
                        truncate
                      "
                      title={district}
                    >
                      {district
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                    </h3>

                    <div className="mt-5 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />

                      <p className="text-zinc-400 text-sm md:text-base">
                        {totalUmkm} UMKM Terdaftar
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      w-11
                      h-11
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      text-zinc-300
                      shrink-0
                      transition-all
                      duration-300
                      group-hover:text-white
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    bg-gradient-to-r
                    from-violet-500
                    via-fuchsia-400
                    to-transparent
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
