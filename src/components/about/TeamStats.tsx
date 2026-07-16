import { teamMembers } from "@/data/team";

export default function TeamStats() {
  const stats = [
    {
      label: "TI & Digitalisasi",
      count: teamMembers.filter((item) => item.bidang === "TI dan Digitalisasi")
        .length,
    },
    {
      label: "Kewirausahaan",
      count: teamMembers.filter((item) => item.bidang === "Kewirausahaan")
        .length,
    },
    {
      label: "Basis Data",
      count: teamMembers.filter((item) => item.bidang === "Basis Data").length,
    },
    {
      label: "Pendamping Lapangan",
      count: teamMembers.filter((item) => item.bidang === "Pendamping Lapangan")
        .length,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-20">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
        >
          <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            {item.count}
          </h3>

          <p className="mt-3 text-sm md:text-base text-white/60">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
