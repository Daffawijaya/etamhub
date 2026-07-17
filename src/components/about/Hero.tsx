import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";

export default function HeroBackground() {
  return (
    <section className="relative overflow-hidden bg-light-bg dark:bg-dark transition-colors">
      {/* Background atas */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[350%]
          sm:w-[280%]
          md:w-[200%]
          lg:w-[150%]
          xl:w-full
          pointer-events-none
        "
        style={{
          WebkitMaskImage: `
            linear-gradient(
              to bottom,
              #000 0%,
              rgba(0,0,0,.85) 10%,
              rgba(0,0,0,.55) 20%,
              rgba(0,0,0,.25) 30%,
              transparent 50%,
              transparent 100%
            )
          `,
          maskImage: `
            linear-gradient(
              to bottom,
              #000 0%,
              rgba(0,0,0,.85) 10%,
              rgba(0,0,0,.55) 20%,
              rgba(0,0,0,.25) 30%,
              transparent 50%,
              transparent 100%
            )
          `,
        }}
      >
        <Image
          src="/bgt.png"
          alt="Background"
          width={1920}
          height={300}
          priority
          className="w-full h-auto"
        />
      </div>

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          z-10
          pointer-events-none
          bg-light-bg
          dark:bg-dark
        "
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
        }}
      />

      {/* Noise */}
      <div
        className="
          absolute 
          inset-0 
          z-20 
          pointer-events-none 
          opacity-20 
          mix-blend-overlay
        "
        style={{
          backgroundImage: "url('/grian.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      />

      {/* Navbar */}
      <div className="relative z-[100] pointer-events-auto">
        <HeroNavbar />
      </div>

      {/* Content */}
      <div
        className="
          relative
          z-30
          flex
          flex-col
          items-center
          justify-center
          mt-6
          py-24
          sm:py-32
          md:mt-10
          md:py-50
          px-5
          sm:px-6
        "
      >
        <h1
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            text-zinc-900
            dark:text-white
            text-center
          "
        >
          tentang etamhub.
        </h1>

        <p
          className="
            mt-4
            sm:mt-5
            md:mt-6
            text-center
            text-zinc-600
            dark:text-zinc-400
            max-w-3xl
            text-sm
            sm:text-base
            md:text-xl
            leading-relaxed
          "
        >
          Menghubungkan UMKM Kutai Kartanegara dengan masyarakat melalui satu
          platform yang memudahkan penemuan, promosi, dan pertumbuhan usaha
          lokal.
        </p>
      </div>
    </section>
  );
}