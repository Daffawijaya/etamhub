"use client";

export default function Hero() {
  const scrollToDistrict = () => {
    const el = document.getElementById("district-section");
    if (!el) return;

    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  };

  const scrollToAbout = () => {
    const el = document.getElementById("about-section");
    if (!el) return;

    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)]">

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-40">
        <div className="max-w-4xl text-white">
          
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            Katalog UMKM Kutai Kartanegara
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight lg:text-7xl">
            Jelajahi UMKM di Setiap
            <span className="block text-violet-300">Kecamatan Kukar</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Temukan produk, layanan, dan usaha lokal unggulan dari berbagai
            kecamatan di Kutai Kartanegara dalam satu platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={scrollToDistrict}
              className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700 transition"
            >
              Pilih Kecamatan
            </button>

            <button
              onClick={scrollToAbout}
              className="rounded-xl bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm hover:bg-white/20 transition"
            >
              Tentang EtamHub
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
