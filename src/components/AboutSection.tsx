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
    <section id="about-section" className="py-15 bg-third">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 items-center">
          {/* IMAGE */}
          <div className="relative">
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full" />

            <div className="relative rounded-md overflow-hidden aspect-[5/4] w-full max-w-[450px] mx-auto">
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
          <div>
            <h2 className="text-5xl font-bold mb-5">
              Tentang EtamHub
            </h2>

            <p className="text-xl max-w-3xl mx-auto text-slate-600 leading-relaxed ">
              EtamHub merupakan platform digital yang dikembangkan untuk
              mendukung transformasi UMKM di Kutai Kartanegara melalui akses
              informasi, promosi produk, dan penguatan ekosistem usaha lokal.
            </p>
            <p className="text-2xl font-bold text-white leading-relaxed">
              
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
