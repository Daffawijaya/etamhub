"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function VisiManfaat() {
  const benefits = [
    {
      number: "01",
      title: "Akses UMKM Lebih Mudah",
      description:
        "Membantu masyarakat menemukan produk, layanan, dan pelaku usaha lokal dalam satu platform terpusat.",
    },
    {
      number: "02",
      title: "Promosi Digital UMKM",
      description:
        "Memberikan ruang promosi yang lebih luas sehingga usaha lokal lebih mudah dikenal oleh masyarakat.",
    },
    {
      number: "03",
      title: "Penguatan Ekonomi Daerah",
      description:
        "Mendukung pertumbuhan UMKM sebagai penggerak ekonomi dan potensi unggulan Kutai Kartanegara.",
    },
  ];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-8 sm:py-10 md:py-12 bg-light-bg dark:bg-dark transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden p-[5px] sm:p-[8px] md:p-[14px]"
      >
        {/* FRAME — shimmer */}
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg,#676c71 0%,#5e6368 24%,#75695d 48%,#603744 61%,#4a315d 76%,#676c71 100%)`,
            backgroundSize: "200% 100%",
          }}
        />

        {/* PANEL */}
        <div className="relative overflow-hidden bg-light-bg dark:bg-dark rounded-sm sm:rounded-lg md:rounded-xl">
          {/* Noise */}
          <motion.div
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            style={{
              backgroundImage: "url('/grian.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "500px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 py-10 sm:py-12 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
              <div className="grid gap-8 sm:gap-10 lg:gap-14 lg:grid-cols-[2fr_3fr]">
                {/* LEFT — title stagger */}
                <motion.div
                  initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col justify-center items-center lg:items-start"
                >
                  <h2 className="text-center lg:text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-zinc-900 dark:text-white max-w-lg leading-tight">
                    {"Manfaat Platform etamhub".split(" ").map((w, i) => (
                      <motion.span
                        key={w + i}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block mr-[0.2em] last:mr-0"
                      >
                        {w}
                      </motion.span>
                    ))}
                  </h2>
                </motion.div>

                {/* RIGHT — benefits stagger */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.18 } } }}
                  className="space-y-3 sm:space-y-4"
                >
                  {benefits.map((item) => (
                    <motion.div
                      key={item.number}
                      variants={{
                        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                      }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="group border border-white dark:border-white/10 bg-light dark:bg-white/[0.03] rounded-xl p-3 sm:p-4 md:p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/[0.05] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_60%)]" />
                      <div className="relative flex gap-3 sm:gap-5 md:gap-6">
                        <motion.span
                          whileHover={{ scale: 1.08 }}
                          className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-400 dark:text-white/20 shrink-0"
                        >
                          {item.number}
                        </motion.span>
                        <div>
                          <h3 className="text-sm sm:text-base md:text-lg text-zinc-900 dark:text-white">{item.title}</h3>
                          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-zinc-600 dark:text-white/60">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Glow — parallax */}
          <motion.div style={{ y } as any} className="absolute -right-40 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl"
            />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.08, 1], x: [0, 8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"
          />
        </div>
      </motion.div>
    </section>
  );
}
