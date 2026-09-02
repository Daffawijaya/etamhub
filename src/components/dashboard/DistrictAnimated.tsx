"use client";

import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "../textBlock/SectionHeader";

type Props = {
  districtMap: Record<string, number>;
  districts: string[];
};

function DistrictCard({ district, total, index }: { district: string; total: number; index: number }) {
  const slug = slugify(district);
  const display = district
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.055, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link
        href={`/kecamatan/${slug}`}
        className="relative overflow-hidden rounded-xl border border-white dark:border-white/10 bg-light dark:bg-[#161616] p-5 sm:p-6 md:p-7 flex items-start justify-between gap-3 sm:gap-4 transition-colors duration-300 dark:hover:border-white/20 hover:bg-[#fbfbfd] dark:hover:bg-[#1a1a1a] block"
      >
        {/* Hover Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top left, rgba(139,92,246,0.12), transparent 55%)",
          }}
        />

        {/* shimmer sweep on hover */}
        <motion.div
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 45%, transparent 60%)",
          }}
        />

        <div className="flex-1 min-w-0 relative z-10">
          <p className="text-xs sm:text-sm text-zinc-500 mb-2 sm:mb-3">Kecamatan</p>

          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900 dark:text-white truncate" title={district}>
            {display}
          </h3>

          <div className="mt-4 sm:mt-5 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
              className="w-2 h-2 rounded-full bg-violet-400 shrink-0"
            />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">{total} UMKM Terdaftar</p>
          </div>
        </div>

        <motion.div
          whileHover={{ x: 4, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-zinc-500 dark:text-zinc-300 shrink-0 relative z-10"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            className="inline-block"
          >
            →
          </motion.span>
        </motion.div>

        {/* bottom accent animated */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </Link>
    </motion.div>
  );
}

export default function DistrictAnimated({ districtMap, districts }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section
      ref={ref}
      id="kecamatan"
      className="relative overflow-hidden bg-light-bg dark:bg-dark py-16 sm:py-20 md:py-32 transition-colors"
    >
      {/* Background Glow with parallax */}
      <motion.div style={{ y: glowY, opacity: glowOpacity }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] md:w-[900px] h-[250px] sm:h-[300px] md:h-[350px] bg-purple-700/10 blur-[120px] md:blur-[180px]"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-violet-500/5 blur-[150px] md:blur-[200px]"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header reveal */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14 md:mb-20"
        >
          <SectionHeader
            title="Pilih Kecamatan"
            description="Telusuri data UMKM Kutai Kartanegara berdasarkan kecamatan dan temukan berbagai usaha lokal yang telah terdaftar dalam sistem."
          />
          {/* header underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
          />
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <DistrictCard key={d} district={d} total={districtMap[d]} index={i} />
          ))}
        </div>

        {districts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-zinc-500 mt-10"
          >
            Belum ada data kecamatan.
          </motion.p>
        )}
      </div>
    </section>
  );
}
