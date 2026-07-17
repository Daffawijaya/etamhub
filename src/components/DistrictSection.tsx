import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";
import SectionHeader from "./textBlock/SectionHeader";

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
      id="kecamatan"
      className="
        relative 
        overflow-hidden 
        bg-light-bg
        dark:bg-dark 
        py-16 
        sm:py-20 
        md:py-32
      "
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div
          className="
            absolute 
            top-0 
            left-1/2 
            -translate-x-1/2 
            w-[500px]
            sm:w-[700px]
            md:w-[900px]
            h-[250px]
            sm:h-[300px]
            md:h-[350px]
            bg-purple-700/10 
            blur-[120px]
            md:blur-[180px]
          "
        />

        <div
          className="
            absolute 
            bottom-0 
            right-0 
            w-[300px]
            sm:w-[400px]
            md:w-[500px]
            h-[300px]
            sm:h-[400px]
            md:h-[500px]
            bg-violet-500/5 
            blur-[150px]
            md:blur-[200px]
          "
        />
      </div>

      <div
        className="
          relative 
          z-10 
          max-w-7xl 
          mx-auto 
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* Header */}
        <div
          className="
            text-center 
            mb-10
            sm:mb-14
            md:mb-20
          "
        >
          <SectionHeader
            title="Pilih Kecamatan"
            description="
              Telusuri data UMKM Kutai Kartanegara berdasarkan kecamatan dan
              temukan berbagai usaha lokal yang telah terdaftar dalam sistem.
            "
          />
        </div>

        {/* Grid */}
        <div
          className="
            grid 
            gap-4
            sm:gap-5
            md:gap-6
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
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
                  rounded-2xl
                  dark:rounded-none
                  border
                  border-white
                  dark:border-white/10
                  bg-light
                  dark:bg-[#161616]
                  p-5
                  sm:p-6
                  md:p-7
                  transition-all
                  duration-300
                  
                  dark:hover:border-white/20
                  hover:bg-[#fbfbfd]
                  dark:hover:bg-[#1a1a1a]
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

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                    gap-3
                    sm:gap-4
                  "
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-zinc-500 mb-2 sm:mb-3">
                      Kecamatan
                    </p>

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        md:text-2xl
                        font-medium
                        text-zinc-900
                        dark:text-white
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

                    <div className="mt-4 sm:mt-5 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />

                      <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        {totalUmkm} UMKM Terdaftar
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      sm:w-11
                      sm:h-11
                      rounded-xl
                      border
                      border-black/10
                      dark:border-white/10
                      bg-black/[0.03]
                      dark:bg-white/[0.03]
                      text-zinc-500
                      dark:text-zinc-300
                      shrink-0
                      transition-all
                      duration-300
                      group-hover:text-zinc-900
                      dark:group-hover:text-white
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
      </div>
    </section>
  );
}
