export default function AboutSection() {
  return (
    <section id="about-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center rounded-3xl bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)] p-8 md:p-12 shadow-xl">
          {/* TEXT */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tentang EtamHub
            </h2>

            <p className="mt-5 text-white/90 leading-relaxed">
              EtamHub adalah platform digital yang dikembangkan oleh Tenaga Ahli
              Pendamping UMKM di bawah Dinas Koperasi dan UKM Kutai Kartanegara.
              Platform ini dirancang untuk mendukung pendataan, pemetaan, dan
              pengembangan UMKM agar lebih mudah diakses dan lebih terstruktur.
            </p>

            <p className="mt-4 text-white/90 leading-relaxed">
              Tujuannya adalah mempercepat transformasi digital UMKM daerah,
              memperluas jangkauan usaha lokal, serta memudahkan masyarakat
              dalam menemukan produk dan layanan UMKM di Kutai Kartanegara.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-white text-sm">
                Digitalisasi UMKM
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-white text-sm">
                Pemetaan Kecamatan
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-white text-sm">
                Data Terintegrasi
              </div>
            </div>
          </div>

          {/* VISUAL */}
          <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-[url('/testing.jpeg')] bg-cover bg-center" />
        </div>
      </div>
    </section>
  );
}
