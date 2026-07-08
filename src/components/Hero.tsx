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
    <section className="bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen items-center flex">
        <div className="flex flex-col items-center w-full">
          <h1 className="mt-8 text-5xl font-bold leading-tight lg:text-7xl flex flex-col items-center">
            Jelajahi UMKM di Setiap
            <span className="block text-black">Kecamatan Kukar</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-black text-center">
            Temukan produk, layanan, dan usaha lokal unggulan dari berbagai
            kecamatan di Kutai Kartanegara dalam satu platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={scrollToDistrict}
              className="rounded-full bg-primary px-6 py-3 font-medium font-semibold text-white hover:bg-violet-700 transition"
            >
              Pilih Kecamatan
            </button>

            <button
              onClick={scrollToAbout}
              className="rounded-full bg-white border border-2 px-6 py-3 font-semibold text-black backdrop-blur-sm hover:bg-black hover:text-white transition"
            >
              Tentang EtamHub
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
