import { umkms } from "@/data/umkm";

export default function StatsSection() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalSubkategori = new Set(umkms.map((item) => item.subkategori)).size;

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
    <section className="bg-dark pb-24 py-12 md:pb-32 md:pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2
          style={{
            background:
              "linear-gradient(180deg,#ffffff 0%,#e4e4e7 35%,#b4b4b8 75%,#71717a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="
    text-center
    text-xl
    md:text-3xl
    lg:text-5xl
    font-semibold
    tracking-tight
  "
        >
          Statistik UMKM
        </h2>

        <p className="mt-6 text-center text-zinc-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah
          pelaku usaha, wilayah kecamatan, hingga ragam kategori usaha.
        </p>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                p-10
                min-h-[260px]
                flex
                flex-col
                justify-center
              "
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
                {stat.value}
              </h3>

              <p className="mt-6 text-xl md:text-2xl font-medium text-white">
                {stat.label}
              </p>

              <p className="mt-3 text-sm md:text-base text-zinc-400 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
