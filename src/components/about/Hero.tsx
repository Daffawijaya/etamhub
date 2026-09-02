"use client";

import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroBackground() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.52], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-light-bg dark:bg-dark transition-colors">
      {/* Background atas — parallax, layout identik */}
      <motion.div
        style={{ y: yBg } as any}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[350%] sm:w-[280%] md:w-[200%] lg:w-[150%] xl:w-full pointer-events-none will-change-transform"
        aria-hidden
      >
        <div
          className="w-full"
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
          <Image src="/bgt.png" alt="Background" width={1920} height={300} priority className="w-full h-auto" />
        </div>
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-light-bg dark:bg-dark transition-colors"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
        }}
      />

      {/* Noise — subtle drift */}
      <motion.div
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('/grian.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      />

      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[100] pointer-events-auto"
      >
        <HeroNavbar />
      </motion.div>

      {/* Content — parallax + stagger */}
      <motion.div
        style={{ y: yText, opacity: opacityText } as any}
        className="relative z-30 flex flex-col items-center justify-center mt-6 py-24 sm:py-32 md:mt-10 md:py-50 px-5 sm:px-6 will-change-transform"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.085, delayChildren: 0.22 } } }}
          className="text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white text-center"
        >
          {"tentang etamhub.".split(" ").map((w, i) => (
            <motion.span
              key={w + i}
              variants={{
                hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
                visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="inline-block mr-[0.24em] last:mr-0"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.62, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-5 md:mt-6 text-center text-zinc-600 dark:text-zinc-400 max-w-3xl text-sm sm:text-base md:text-xl leading-relaxed"
        >
          Menghubungkan UMKM Kutai Kartanegara dengan masyarakat melalui satu platform yang memudahkan penemuan, promosi, dan
          pertumbuhan usaha lokal.
        </motion.p>
      </motion.div>
    </section>
  );
}
