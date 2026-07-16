export default function AboutPlatformSection() {
  const items = [
    {
      title: "Tentang Platform",
      description:
        "etamhub hadir sebagai pusat informasi UMKM Kutai Kartanegara yang membantu masyarakat menemukan produk, layanan, dan potensi usaha lokal dalam satu tempat.",
    },
    {
      title: "Tujuan",
      description:
        "Mendorong transformasi digital UMKM serta memperluas jangkauan promosi produk dan jasa unggulan daerah.",
    },
    {
      title: "Visi",
      description:
        "Menjadi platform digital yang memperkuat ekosistem UMKM Kutai Kartanegara yang terhubung, tumbuh, dan berinovasi.",
    },
    {
      title: "Inisiator & Pengembang",
      description:
        "etamhub diinisiasi dan dikembangkan oleh Tenaga Ahli Pendamping UMKM sebagai upaya mendukung digitalisasi, promosi, dan pengembangan UMKM Kutai Kartanegara secara berkelanjutan.",
    },
  ];

  return (
    <section className="bg-dark pb-12 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="
                bg-[#1b1b1b]
                border
                border-zinc-800
                hover:border-zinc-700
                transition-all
                duration-300
                p-5
                sm:p-6
                md:p-10
                min-h-[180px]
                sm:min-h-[220px]
                md:min-h-[280px]
                flex
                flex-col
                justify-center
              "
            >
              <h3
                className="
                  text-xl
                  sm:text-2xl
                  md:text-4xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-3
                  sm:mt-4
                  md:mt-6
                  text-sm
                  sm:text-base
                  md:text-lg
                  text-zinc-400
                  leading-relaxed
                "
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
