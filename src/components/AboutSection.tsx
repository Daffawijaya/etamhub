"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const images = [
    "/testing.jpeg",
    "/umkmdaffa.jpeg",
    "/testing.jpeg",
  ];

  const sliderImages = [...images, images[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === images.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrentIndex(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransition(true);
          });
        });
      }, 700); // harus sama dengan duration slider

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, images.length]);

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
            </p>

            <p className="mt-4 text-white/90 leading-relaxed">
              Tujuannya adalah mempercepat transformasi digital UMKM daerah,
              memperluas jangkauan usaha lokal, serta memudahkan masyarakat
              menemukan produk dan layanan UMKM.
            </p>
          </div>

          {/* SLIDER */}
          <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden">
            <div
              className={`flex h-full ${
                transition
                  ? "transition-transform duration-700 ease-in-out"
                  : ""
              }`}
              style={{
                width: `${sliderImages.length * 100}%`,
                transform: `translateX(-${
                  currentIndex * (100 / sliderImages.length)
                }%)`,
              }}
            >
              {sliderImages.map((image, index) => (
                <div
                  key={index}
                  className="shrink-0 h-full bg-cover bg-center"
                  style={{
                    width: `${100 / sliderImages.length}%`,
                    backgroundImage: `url(${image})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}