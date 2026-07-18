"use client";

import Image from "next/image";
import HeroNavbar from "./navbar/HeroNavbar";

export default function Hero() {
  return (
    <section
      className="min-h-[111vh] relative overflow-hidden"
      style={{
        background: `
          linear-gradient(
            to top,
            #121313 0%,
            #4b4038 20%,
            #605247 40%,
            #686665 60%,
            #6a6c6e 70%,
            #515b65 85%,
            #434d58 100%
          )
        `,
      }}
    >
      <div className="absolute z-40 h-full w-full">
        <HeroNavbar />
      </div>
      
      <div
        className="absolute z-20 inset-0 pointer-events-none opacity-18 mix-blend-overlay"
        style={{
          backgroundImage: "url('/grian.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      />

      {/* Text Tengah */}
      <div className="absolute inset-0 flex items-center justify-center z-30 -translate-y-22">
        <h1 className="text-white text-3xl font-normal md:text-6xl text-center px-4 leading-tight">
          Jelajahi Seluruh UMKM
          <br />
          Kutai Kartanegara
        </h1>
      </div>

      {/* dark */}
      <div className="hidden dark:block h-full w-full">
        <div className="absolute bottom-0 left-0 w-[300%] sm:w-[250%] md:w-[200%] lg:w-[150%] xl:w-full">
          <Image
            src="/bgw.png"
            alt="Background"
            width={1920}
            height={400}
            priority
            className="w-full h-auto"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #121313 30%, rgba(18,19,19,0.9) 50%, rgba(18,19,19,0.4) 85%, transparent 100%)",
              maskImage: "url('/bgw.png')",
              maskSize: "100% auto",
              maskRepeat: "no-repeat",
              maskPosition: "bottom",
              WebkitMaskImage: "url('/bgw.png')",
              WebkitMaskSize: "100% auto",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "bottom",
            }}
          />
        </div>
      </div>

      {/* light */}
      <div className="block dark:hidden h-full w-full">
        <div className="absolute z-0 top-0 left-0 w-[300%] sm:w-[250%] md:w-[200%] lg:w-[150%] xl:w-full">
          <Image
            src="/bgw2.webp"
            alt="Background"
            width={1920}
            height={400}
            priority
            className="w-full h-auto"
          />
        </div>
        <div
          className="absolute z-10 inset-0 pointer-events-none dark:hidden transition-colors"
          style={{
            background: `
      linear-gradient(
  to bottom,
  rgba(0,0,0,.5) 0%,
  rgba(0,0,0,.3) 10%,
  rgba(231,231,241,.1) 50%,
  rgba(231,231,241,.1) 65%,
  rgba(231,231,241,.3) 80%,
  rgba(231,231,241,.7) 92%,
  rgba(231,231,241,1) 100%
)
    `,
          }}
        />
      </div>
    </section>
  );
}
