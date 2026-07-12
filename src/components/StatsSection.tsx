import { umkms } from "@/data/umkm";

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
    <section className="py-16 md:py-24 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-900">
          Statistik UMKM
        </h2>

        <p className="mt-4 md:mt-5 text-center text-slate-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah
          pelaku usaha, wilayah kecamatan, hingga ragam kategori usaha.
        </p>

        <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                text-center px-6 md:px-8 lg:px-10 py-8 
                border-b md:border-b-0 border-slate-200
                ${
                  index !== stats.length - 1
                    ? ""
                    : ""
                }
                ${
                  index === stats.length - 1
                    ? ""
                    : ""
                }
              `}
            >
              <h3 className="text-4xl  md:text-5xl lg:text-6xl font-bold text-primary">
                {stat.value}
              </h3>

              <p className="mt-3 md:mt-4 text-base md:text-lg font-semibold text-slate-800">
                {stat.label}
              </p>

              <p className=" text-sm md:text-base text-slate-500">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}