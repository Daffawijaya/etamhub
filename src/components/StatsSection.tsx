import { umkms } from "@/data/umkm";
import SectionHeader from "./textBlock/SectionHeader";

export default function StatsSection() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(
    umkms.map((item) => item.kecamatan)
  ).size;

  const totalSubkategori = new Set(
    umkms.map((item) => item.subkategori)
  ).size;

  const stats = [
    {
      value: totalKecamatan,
      label: "Kecamatan",
      desc: "Wilayah yang telah bergabung",
    },
    {
      value: totalUmkm,
      label: "UMKM",
      desc: "Usaha yang terdaftar",
    },
    {
      value: totalSubkategori,
      label: "Subkategori",
      desc: "Ragam bidang usaha",
    },
  ];

  return (
    <section className="bg-dark py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          title="Statistik UMKM"
          description="Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah pelaku usaha, wilayah kecamatan, hingga ragam kategori usaha."
        />

        <div
          className="
            mt-10
            sm:mt-14
            md:mt-20
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-6
          "
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                bg-[#1b1b1b]
                border
                border-zinc-800
                hover:border-zinc-700
                transition-all
                duration-300

                p-6
                sm:p-8
                md:p-10

                min-h-[180px]
                sm:min-h-[220px]
                md:min-h-[260px]

                flex
                flex-col
                justify-center
              "
            >
              <h3
                className="
                  text-4xl
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {stat.value}
              </h3>

              <p
                className="
                  mt-3
                  sm:mt-5
                  text-lg
                  sm:text-xl
                  md:text-2xl
                  font-medium
                  text-white
                "
              >
                {stat.label}
              </p>

              <p
                className="
                  mt-2
                  sm:mt-3
                  text-sm
                  sm:text-base
                  text-zinc-400
                  leading-relaxed
                  max-w-xs
                "
              >
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}