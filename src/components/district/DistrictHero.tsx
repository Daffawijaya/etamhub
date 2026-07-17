type Props = {
  districtName: string;
  totalSubkategori: number;
  totalUmkm: number;
  urutTerdekat: boolean;
};

export default function DistrictHero({
  districtName,
  totalSubkategori,
  totalUmkm,
  urutTerdekat,
}: Props) {
  return (
    <section className="relative overflow:hidden">
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white
          bg-light-bg
          dark:border-white/10
          dark:bg-[#161616]
          p-6
          md:p-8
          transition-all
          duration-300
          hover:border-white
          dark:hover:border-white/20
          hover:bg-light
          dark:hover:bg-[#1a1a1a]
        "
      >
        {/* Hover Glow */}
        <div
          className="
            absolute
            inset-0
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_50%)]
          "
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
          {/* Left */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-zinc-500">
              Kecamatan
            </p>

            <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-white md:text-5xl">
              {districtName}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
              Telusuri berbagai UMKM yang terdaftar di Kecamatan{" "}
              <span className="text-zinc-900 dark:text-white">
                {districtName}
              </span>
              <br />
              Temukan produk maupun layanan lokal unggulan yang siap berkembang
              bersama ekosistem UMKM Kutai Kartanegara.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white bg-light px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Total UMKM
              </span>

              <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                {totalUmkm}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white bg-light px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Subkategori
              </span>

              <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                {totalSubkategori}
              </span>
            </div>

            <div
              className={`
                flex
                items-center
                justify-between
                rounded-xl
                border
                px-4
                py-3
                transition-all
                duration-300
                ${
                  urutTerdekat
                    ? "border-violet-500/20 bg-violet-500/10"
                    : "border-white bg-light dark:border-white/10 dark:bg-white/[0.03]"
                }
              `}
            >
              <span
                className={`text-sm ${
                  urutTerdekat
                    ? "text-violet-300"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                Mode
              </span>

              <span className="font-medium text-zinc-900 dark:text-white">
                {urutTerdekat ? "📍 Terdekat" : "A - Z"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-0
            bg-gradient-to-r
            from-violet-500
            via-fuchsia-400
            to-transparent
            transition-all
            duration-500
            group-hover:w-full
          "
        />
      </div>
    </section>
  );
}