"use client";

type Props = {
  kategori: string;
  setKategori: (value: string) => void;
  total: number;
  urutTerdekat: boolean;
  setUrutTerdekat: (value: boolean) => void;
};

export default function KategoriFilter({
  kategori,
  setKategori,
  total,
  urutTerdekat,
  setUrutTerdekat,
}: Props) {
  const categories = ["Semua", "Jasa", "Industri", "Perdagangan"];

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#161616]
        p-4
        md:p-5
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_45%)]
          pointer-events-none
        "
      />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div
          className="
            inline-flex
            bg-white/[0.04]
            border
            border-white/10
            backdrop-blur-xl
            rounded-xl
            p-1
            gap-1
            overflow-x-auto
            scrollbar-hide
            max-w-full
          "
        >
          {categories.map((item) => {
            const active = kategori === item;

            return (
              <button
                key={item}
                onClick={() => setKategori(item)}
                className={`
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  whitespace-nowrap
                  transition-all
                  duration-300
                  ${
                    active
                      ? `
                        bg-white
                        text-black
                      `
                      : `
                        text-white/60
                        hover:text-white
                        hover:bg-white/5
                      `
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2
            "
          >
            <div className="h-2 w-2 rounded-full bg-violet-400" />

            <span className="text-sm text-zinc-300">{total} UMKM</span>
          </div>

          <button
            onClick={() => setUrutTerdekat(!urutTerdekat)}
            className={`
              rounded-xl
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              duration-300
              border
              ${
                urutTerdekat
                  ? `
                    border-violet-500/30
                    bg-gradient-to-r
                    from-violet-500
                    via-purple-500
                    to-fuchsia-500
                    text-white
                    shadow-lg
                    shadow-violet-500/20
                  `
                  : `
                    border-white/10
                    bg-white/[0.04]
                    text-zinc-300
                    hover:border-violet-500/30
                    hover:bg-violet-500/10
                    hover:text-white
                  `
              }
            `}
          >
            📍 Lokasi Terdekat
          </button>
        </div>
      </div>
    </div>
  );
}
