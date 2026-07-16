import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";

export default function HeroBackground() {
  return (
    <section className="relative overflow-hidden bg-dark">
      {/* Background atas */}
      <div
        className=" absolute
  top-0
  left-1/2
  -translate-x-1/2
  w-[300%]
  sm:w-[250%]
  md:w-[200%]
  lg:w-[150%]
  xl:w-full
  pointer-events-none"
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

      {/* Overlay hitam */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-dark"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay"
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
      <div className="relative z-30 flex flex-col items-center justify-center mt-10 py-50">
        <h1 className="text-5xl text-white text-center">tentang etamhub.</h1>

        <p className="mt-6 text-center text-zinc-400 max-w-3xl text-lg md:text-xl leading-relaxed">
          Menghubungkan UMKM Kutai Kartanegara dengan masyarakat melalui satu
          platform yang memudahkan penemuan, promosi, dan pertumbuhan usaha
          lokal.
        </p>
      </div>
    </section>
  );
}
