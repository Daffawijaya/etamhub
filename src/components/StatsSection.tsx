import { umkms } from "@/data/umkm";

export default function StatsSection() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalKategori = new Set(umkms.map((item) => item.kategori)).size;

  const stats = [
    {
      value: totalKecamatan,
      label: "Kecamatan",
    },
    {
      value: totalUmkm,
      label: "UMKM Terdaftar",
    },
    {
      value: totalKategori,
      label: "Kategori Usaha",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-violet-50 to-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-3">
              <div className="h-1 w-12 rounded-full bg-violet-600" />

              <h2 className="text-5xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
