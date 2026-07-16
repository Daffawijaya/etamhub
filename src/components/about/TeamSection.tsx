import TeamCard from "./TeamCard";

interface TeamSectionProps {
  title: string;
  members: {
    nama: string;
    bidang?: string;
    desc?: string;
    gambar: string;
    featured?: boolean;
  }[];
  grid?: boolean;
}

export default function TeamSection({
  title,
  members,
  grid = false,
}: TeamSectionProps) {
  return (
    <section className="pt-5 pb-28">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <h2
          style={{
            background:
              "linear-gradient(180deg,#ffffff 0%,#e4e4e7 35%,#b4b4b8 75%,#71717a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="
            mb-16
            text-center
            text-3xl
            md:text-4xl
            lg:text-5xl
            font-semibold
            tracking-tight
            leading-[1.15]
            pb-2
          "
        >
          {title}
        </h2>

        <div
          className={
            grid
              ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-stretch auto-rows-fr"
              : "flex flex-wrap justify-center items-stretch gap-8 md:gap-10"
          }
        >
          {members.map((item) => (
            <div
              key={item.nama}
              className={grid ? "h-full" : "w-full sm:w-[280px] h-full"}
            >
              <TeamCard
                nama={item.nama}
                jabatan={item.desc || item.bidang || ""}
                foto={item.gambar}
                featured={item.featured}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
