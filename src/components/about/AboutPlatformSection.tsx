export default function AboutPlatformSection() {
  return (
    <section className="bg-dark pb-12 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-6">
          {/* Tentang Platform */}
          <div
            className="
              bg-[#1b1b1b]
              border
              border-zinc-800
              hover:border-zinc-700
              transition-all
              duration-300
              p-10
              min-h-[320px]
              flex
              flex-col
              justify-center
            "
          >
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Tentang Platform
            </h3>

            <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl">
              EtamHub hadir sebagai pusat informasi UMKM Kutai Kartanegara yang
              membantu masyarakat menemukan produk, layanan, dan potensi usaha
              lokal dalam satu tempat.
            </p>
          </div>

          {/* Tujuan & Visi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="
                bg-[#1b1b1b]
                border
                border-zinc-800
                hover:border-zinc-700
                transition-all
                duration-300
                p-10
                min-h-[280px]
                flex
                flex-col
                justify-center
              "
            >
              <h3 className="text-3xl font-semibold tracking-tight text-white">
                Tujuan
              </h3>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed">
                Mendorong transformasi digital UMKM serta memperluas jangkauan
                promosi produk dan jasa unggulan daerah.
              </p>
            </div>

            <div
              className="
                bg-[#1b1b1b]
                border
                border-zinc-800
                hover:border-zinc-700
                transition-all
                duration-300
                p-10
                min-h-[280px]
                flex
                flex-col
                justify-center
              "
            >
              <h3 className="text-3xl font-semibold tracking-tight text-white">
                Visi
              </h3>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed">
                Menjadi platform digital yang memperkuat ekosistem UMKM Kutai
                Kartanegara yang terhubung, tumbuh, dan berinovasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
