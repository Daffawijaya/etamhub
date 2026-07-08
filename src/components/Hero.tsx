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
    <section className="bg-[#4A154B] min-h-screen flex items-center overflow-hidden pt-15">
      <div className="max-w-7xl mx-auto w-full pl-3 lg:pl-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-white font-bold leading-[1.05] text-5xl lg:text-6xl">
              Jelajahi UMKM dari seluruh
            </h1>
            <h1 className="text-secondary font-bold leading-[1.05] text-5xl lg:text-6xl">Kecamatan Kukar</h1>

            <p className="mt-8 text-lg lg:text-xl text-white/90 max-w-xl leading-relaxed">
              Temukan produk, layanan, dan usaha lokal unggulan dari berbagai
              kecamatan di Kutai Kartanegara dalam satu platform digital yang
              mudah dijelajahi.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={scrollToDistrict}
                className="bg-white text-[#4A154B] px-8 py-4 font-semibold rounded-md hover:scale-105 transition"
              >
                PILIH KECAMATAN
              </button>

              <button
                onClick={scrollToAbout}
                className="bg-[#1264A3] text-white px-8 py-4 font-semibold rounded-md hover:scale-105 transition"
              >
                TENTANG ETAMHUB
              </button>
            </div>

            <p className="mt-6 text-white/80 text-lg">
              Platform UMKM Kutai Kartanegara
            </p>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute w-[450px] h-[450px] rounded-full bg-black/10 blur-3xl" />

            <div className="relative w-full max-w-[600px] h-[420px]">
              {/* Browser Window */}
              <div className="absolute right-0 top-0 w-[500px] h-[330px] bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="h-12 bg-[#3b103b] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                <div className="p-6">
                  <div className="h-5 w-40 bg-gray-200 rounded mb-6" />

                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="h-4 w-52 bg-gray-300 rounded mb-3" />
                    <div className="h-4 w-64 bg-gray-200 rounded mb-6" />

                    <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-300 to-pink-300" />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="absolute left-0 bottom-0 w-[170px] h-[330px] bg-white rounded-[2rem] shadow-2xl border-[8px] border-[#2c0d2d] overflow-hidden">
                <div className="h-6 w-24 bg-[#2c0d2d] rounded-b-xl mx-auto" />

                <div className="p-4">
                  <div className="h-4 w-24 bg-gray-300 rounded mb-6" />

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-300" />
                    <div>
                      <div className="h-3 w-16 bg-gray-300 rounded mb-2" />
                      <div className="h-2 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pink-300" />
                    <div>
                      <div className="h-3 w-16 bg-gray-300 rounded mb-2" />
                      <div className="h-2 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="mt-8 h-20 bg-gray-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
