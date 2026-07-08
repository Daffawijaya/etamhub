"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const images = ["/testing.jpeg", "/umkmdaffa.jpeg"];

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
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, images.length]);

  return (
    <section
      id="about-section"
      className="py-16 md:py-24 lg:py-28 bg-third"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* IMAGE */}
          <div className="relative order-1">
            <div className="relative rounded-md overflow-hidden aspect-[5/4] w-full max-w-[500px] mx-auto">
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

          {/* TEXT */}
          <div className="order-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 text-slate-900">
              Tentang EtamHub
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
              EtamHub merupakan platform digital yang dikembangkan untuk
              mendukung transformasi UMKM di Kutai Kartanegara melalui akses
              informasi, promosi produk, dan penguatan ekosistem usaha lokal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}