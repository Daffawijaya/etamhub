"use client";

import { motion, AnimatePresence } from "framer-motion";
import TeamCard from "./TeamCard";

interface TeamSectionProps {
  title: string;
  members: {
    nama: string;
    bidang?: string;
    desc?: string;
    gambar: string;
    featured?: boolean;
  }[];
  grid?: boolean;
}

export default function TeamSection({ title, members, grid = false }: TeamSectionProps) {
  return (
    <section id="pendamping" className="bg-light-bg dark:bg-dark pt-3 sm:pt-5 pb-16 sm:pb-20 lg:pb-28 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10 lg:mb-16 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] pb-1 lg:pb-2 text-zinc-900 dark:text-white"
        >
          {title.split(" ").map((w, i) => (
            <motion.span
              key={w + i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.22em] last:mr-0"
            >
              {w}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
          className={
            grid
              ? `grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10 items-stretch auto-rows-fr justify-items-center`
              : `flex flex-wrap justify-center items-stretch gap-4 sm:gap-6 md:gap-10`
          }
        >
          <AnimatePresence mode="popLayout">
            {members.map((item, idx) => (
              <motion.div
                key={item.nama}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={grid ? "h-full w-full flex justify-center" : "w-full max-w-[260px] sm:w-[280px] h-full"}
              >
                <TeamCard nama={item.nama} jabatan={item.desc || item.bidang || ""} foto={item.gambar} featured={item.featured} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
