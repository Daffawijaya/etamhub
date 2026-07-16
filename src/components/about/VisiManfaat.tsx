export default function VisiManfaat() {
  const benefits = [
    {
      number: "01",
      title: "Akses UMKM Lebih Mudah",
      description:
        "Membantu masyarakat menemukan produk, layanan, dan pelaku usaha lokal dalam satu platform terpusat.",
    },
    {
      number: "02",
      title: "Promosi Digital UMKM",
      description:
        "Memberikan ruang promosi yang lebih luas sehingga usaha lokal lebih mudah dikenal oleh masyarakat.",
    },
    {
      number: "03",
      title: "Penguatan Ekonomi Daerah",
      description:
        "Mendukung pertumbuhan UMKM sebagai penggerak ekonomi dan potensi unggulan Kutai Kartanegara.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-8 sm:py-10 md:py-12 bg-dark">
      <div className="relative overflow-hidden p-[5px] sm:p-[8px] md:p-[14px]">
        {/* FRAME */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                #676c71 0%,
                #5e6368 24%,
                #75695d 48%,
                #603744 61%,
                #4a315d 76%,
                #676c71 100%
              )
            `,
          }}
        />

        {/* PANEL */}
        <div className="relative overflow-hidden bg-dark rounded-sm sm:rounded-lg md:rounded-xl">
          {/* Noise */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            style={{
              backgroundImage: "url('/grian.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "500px",
            }}
          />

          {/* Content */}
          <div
            className="
              relative
              z-10
              py-10
              sm:py-12
              md:py-20
            "
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
              <div
                className="
                  grid
                  gap-8
                  sm:gap-10
                  lg:gap-14
                  lg:grid-cols-[2fr_3fr]
                "
              >
                {/* LEFT */}
                <div
                  className="
    flex
    flex-col
    justify-center
    items-center
    lg:items-start
  "
                >
                  <h2
                    className="
      text-center
      lg:text-left
      text-2xl
      sm:text-3xl
      md:text-4xl
      lg:text-5xl
      text-white
      max-w-lg
      leading-tight
    "
                  >
                    Manfaat Platform EtamHub
                  </h2>
                </div>

                {/* RIGHT */}
                <div className="space-y-3 sm:space-y-4">
                  {benefits.map((item) => (
                    <div
                      key={item.number}
                      className="
                        group
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-3
                        sm:p-4
                        md:p-6
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        hover:border-white/20
                        hover:bg-white/[0.05]
                      "
                    >
                      <div className="flex gap-3 sm:gap-5 md:gap-6">
                        <span
                          className="
                            text-2xl
                            sm:text-3xl
                            md:text-4xl
                            font-light
                            text-white/20
                          "
                        >
                          {item.number}
                        </span>

                        <div>
                          <h3
                            className="
                              text-sm
                              sm:text-base
                              md:text-lg
                              text-white
                            "
                          >
                            {item.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              sm:mt-2
                              text-xs
                              sm:text-sm
                              md:text-base
                              leading-relaxed
                              text-white/60
                            "
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -right-40 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
