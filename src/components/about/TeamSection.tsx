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
    <section className="pb-28">
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          {title}
        </h2>

        <div
          className={
            grid
              ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-12"
              : "flex flex-wrap justify-center items-center gap-10"
          }
        >
          {members.map((item) => (
            <div
              key={item.nama}
              className={!grid ? "w-full sm:w-[280px]" : ""}
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