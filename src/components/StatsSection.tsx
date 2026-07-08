import { umkms } from "@/data/umkm";

export default function StatsSection() {
  const totalUmkm = umkms.length;
  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;
  const totalKategori = new Set(umkms.map((item) => item.kategori)).size;

  const stats = [
    {
      value: totalKecamatan,
      label: "Kecamatan",
      active: true,
    },
    {
      value: totalUmkm,
      label: "UMKM",
    },
    {
      value: totalKategori,
      label: "Kategori",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-5xl font-bold text-center mb-5">Statistik UMKM</h2>

      <p className="text-xl max-w-3xl mx-auto text-center text-slate-600 leading-relaxed mb-12">
        Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah pelaku
        usaha, wilayah kecamatan, hingga ragam kategori usaha.
      </p>

      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-slate-100 p-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`min-w-[180px] px-8 py-5 rounded-xl text-center transition-all duration-300 ${
                stat.active
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
