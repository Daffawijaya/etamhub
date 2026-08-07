import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";

export default function HeaderNews() {
  return (
    <section className="absolute h-full w-full overflow-hidden bg-light-bg dark:bg-dark transition-colors">
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
          dark:bg-dark transition-colors
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

      {/* Content */}
      <div
        className="
        
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
      ></div>
    </section>
  );
}
