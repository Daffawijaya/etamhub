import { umkms } from "@/data/umkm";

export default function StatsSection() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalKategori = new Set(umkms.map((item) => item.kategori)).size;

  const stats = [
    {
      value: totalKecamatan,
      label: "Kecamatan",
      color: "primary",
    },
    {
      value: totalUmkm,
      label: "UMKM Terdaftar",
      color: "secondary",
    },
    {
      value: totalKategori,
      label: "Kategori Usaha",
      color: "third",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 ${
              stat.color === "primary"
                ? "hover:border-primary"
                : stat.color === "secondary"
                  ? "hover:border-secondary"
                  : "hover:border-third"
            }`}
          >
            <h2
              className={`text-5xl font-bold text-slate-900 transition-colors duration-300 ${
                stat.color === "primary"
                  ? "group-hover:text-primary"
                  : stat.color === "secondary"
                    ? "group-hover:text-secondary"
                    : "group-hover:text-third"
              }`}
            >
              {stat.value}
            </h2>

            <p className="mt-3 text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
