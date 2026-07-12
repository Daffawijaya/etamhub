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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mt-12 md:mt-20">
      {stats.map((item) => (
        <div key={item.label}>
          <h3 className="text-4xl md:text-6xl font-bold text-primary">
            {item.count}
          </h3>

          <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
