import { MapPinned, Store, Tags } from "lucide-react";

interface Props {
  stats: {
    totalUmkm: number;
    totalKecamatan: number;
    totalSubkategori: number;
  };
}

export default function StatsCards({ stats }: Props) {
  return (
    <div
      className="
        relative overflow-clip rounded-2xl px-5 py-5 text-white sm:p-8
        bg-gradient-to-br

        from-[#ff7a59]
        via-[#ff6b7d]
        to-[#ff4fa3]

        dark:from-[#1b1027]
        dark:via-[#21152f]
        dark:to-[#130f1d]

        transition-all
        duration-500
        ease-in-out
      "
    >
      <div
        className="
          absolute -right-16 -top-16
          h-48 w-48 rounded-full
          bg-white/10 blur-2xl

          dark:bg-[#ff4fa3]/20
        "
      />

      <div
        className="
          absolute -bottom-20 -left-10
          h-48 w-48 rounded-full
          bg-white/10 blur-2xl

          dark:bg-[#1184CA]/20
        "
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className="
              rounded-2xl bg-white/20 p-3
              backdrop-blur-md

              dark:bg-white/10
            "
          >
            <Store size={24} />
          </div>

          <div className="min-w-0 text-right">
            <p className="text-xs text-white/70 sm:text-sm">Total UMKM</p>

            <h2 className="text-4xl font-bold leading-none sm:text-6xl">
              {stats.totalUmkm.toLocaleString("id-ID")}
            </h2>

            <p className="mt-1 text-xs text-white/70 sm:text-sm">Terdaftar di etamhub.</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4">
          <div
            className="
              rounded-2xl bg-white/10 p-3 backdrop-blur-sm sm:p-4

              dark:bg-white/5
              dark:border dark:border-white/10
            "
          >
            <div className="mb-2 flex items-center gap-2">
              <MapPinned size={16} />

              <span className="text-sm text-white/80">Kecamatan</span>
            </div>

            <p className="text-xl font-bold sm:text-2xl">{stats.totalKecamatan}</p>
          </div>

          <div
            className="
              rounded-2xl bg-white/10 p-4
              backdrop-blur-sm

              dark:bg-white/5
              dark:border dark:border-white/10
            "
          >
            <div className="mb-2 flex items-center gap-2">
              <Tags size={16} />

              <span className="text-sm text-white/80">Subkategori</span>
            </div>

            <p className="text-xl font-bold sm:text-2xl">{stats.totalSubkategori}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
