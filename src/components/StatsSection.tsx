import { umkms } from "@/data/umkm";

export default function StatsSection() {
  const totalUmkm = umkms.length;
  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalKategori = new Set(umkms.map((item) => item.kategori)).size;

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
      value: totalKategori,
      label: "Kategori",
      desc: "Ragam bidang usaha",
    },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-slate-900">
          Statistik UMKM
        </h2>

        <p className="mt-5 text-center text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah
          pelaku usaha, wilayah kecamatan, hingga ragam kategori usaha.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                text-center px-10 py-8
                ${
                  index !== stats.length - 1
                    ? "md:border-r border-slate-200"
                    : ""
                }
              `}
            >
              <h3 className="text-6xl font-bold text-[#0F172A]">
                {stat.value}
              </h3>

              <p className="mt-4 text-lg font-semibold text-slate-800">
                {stat.label}
              </p>

              <p className="mt-2 text-sm text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
