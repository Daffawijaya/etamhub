import BottomGlow from "../decoration/BottomGlow";
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
    <section className="bg-light-bg dark:bg-dark pt-3 sm:pt-5 pb-16 sm:pb-20 lg:pb-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        <h2
          className="
            mb-8
            sm:mb-10
            lg:mb-16
            text-center
            text-2xl
            sm:text-3xl
            md:text-4xl
            lg:text-5xl
            font-semibold
            tracking-tight
            leading-[1.15]
            pb-1
            lg:pb-2

            text-zinc-900
            dark:text-white
          "
        >
          {title}
        </h2>

        <div
          className={
            grid
              ? `
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
                sm:gap-6
                md:gap-10
                items-stretch
                auto-rows-fr
                justify-items-center
              `
              : `
                flex
                flex-wrap
                justify-center
                items-stretch
                gap-4
                sm:gap-6
                md:gap-10
              `
          }
        >
          {members.map((item) => (
            <div
              key={item.nama}
              className={
                grid
                  ? "h-full w-full flex justify-center"
                  : "w-full max-w-[260px] sm:w-[280px] h-full"
              }
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
