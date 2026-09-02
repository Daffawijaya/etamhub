"use client";

import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";
import BigChevronButtonButton from "../button/BigChevronButton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();
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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="absolute z-40 w-full"
      >
        <HeroNavbar />
      </motion.div>

      <div
        className="absolute z-20 inset-0 pointer-events-none opacity-18 mix-blend-overlay"
        style={{
          backgroundImage: "url('/grian.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      />

      {/* Text Tengah — layout & className identik commit terakhir */}
      <div className="absolute inset-0 flex items-center justify-center z-30 -translate-y-22">
        <div className="flex flex-col justify-center items-center space-y-4 md:space-y-8">
          <h1 className="text-white text-3xl font-normal md:text-6xl text-center px-4 leading-tight">
            <motion.span
              initial={{ y: 18, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              Jelajahi Seluruh UMKM
            </motion.span>
            <br />
            <motion.span
              initial={{ y: 18, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              Kutai Kartanegara
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <BigChevronButtonButton
              title="Pilih Kecamatan"
              onClick={() => {
                document.getElementById("kecamatan")?.scrollIntoView({ behavior: "smooth" });
                window.history.replaceState(null, "", "#kecamatan");
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* dark — 100% identik commit terakhir, tanpa transform */}
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

      {/* light — 100% identik commit terakhir, overlay gradasi bawah tetap ada */}
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

      {/* scroll indicator — hitam di light mode, putih di dark mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-[0.28em] uppercase text-black/50 dark:text-white/50">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[22px] h-[34px] rounded-full border border-black/15 dark:border-white/20 flex justify-center pt-2 backdrop-blur"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-black dark:bg-white"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
