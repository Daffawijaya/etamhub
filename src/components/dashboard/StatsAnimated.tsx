"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import SectionHeader from "../textBlock/SectionHeader";

type Stat = { value: number; label: string; desc: string };

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.floor(latest).toLocaleString("id-ID");
    });
    return () => unsub();
  }, [spring]);

  return <span ref={ref}>0</span>;
}

export default function StatsAnimated({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-light-bg dark:bg-dark py-12 sm:py-16 md:py-24 transition-colors overflow-hidden relative">
      {/* ambient dots */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "26px 26px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            title="Statistik UMKM"
            description="Menampilkan sebaran UMKM yang telah bergabung, mulai dari jumlah pelaku usaha, wilayah kecamatan, hingga ragam kategori usaha."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
          className="mt-10 sm:mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 28, filter: "blur(8px)", scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="group relative bg-light dark:bg-[#1b1b1b] rounded-2xl border border-white dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors duration-300 p-6 sm:p-8 md:p-10 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex flex-col justify-center overflow-hidden"
            >
              {/* hover gradient wash */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(600px circle at 0% 0%, rgba(139,92,246,0.09), transparent 40%), radial-gradient(500px circle at 100% 100%, rgba(202,55,133,0.06), transparent 45%)",
                }}
              />

              <h3 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-baseline gap-1">
                <CountUp value={stat.value} />
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 220 }}
                  className="text-violet-500 text-3xl md:text-4xl font-normal"
                >
                  +
                </motion.span>
              </h3>

              <p className="relative mt-3 sm:mt-5 text-lg sm:text-xl md:text-2xl font-medium text-zinc-900 dark:text-white">
                {stat.label}
              </p>

              <p className="relative mt-2 sm:mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
                {stat.desc}
              </p>

              {/* bottom sheen */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
