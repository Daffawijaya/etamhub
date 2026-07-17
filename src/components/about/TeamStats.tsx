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
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-3
        sm:gap-4
        md:gap-8
        mt-8
        sm:mt-12
        md:mt-20
      "
    >
      {stats.map((item) => (
        <div
          key={item.label}
          className="
            border
            border-white
            dark:border-white/10
            bg-light
            dark:bg-white/[0.03]
            rounded-2xl
            dark:rounded-none
            backdrop-blur-sm
            p-3
            sm:p-4
            md:p-6
          "
        >
          <h3
            className="
              text-3xl
              sm:text-4xl
              md:text-6xl
              font-bold
              text-zinc-900
              dark:text-white
              tracking-tight
            "
          >
            {item.count}
          </h3>

          <p
            className="
              mt-1
              sm:mt-2
              md:mt-3
              text-xs
              sm:text-sm
              md:text-base
              text-zinc-600
              dark:text-white/60
              leading-snug
            "
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}