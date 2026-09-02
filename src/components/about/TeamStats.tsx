"use client";

import { teamMembers } from "@/data/team";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 120 });
  const inView = useInView(ref, { once: true, margin: "-30px" });
  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);
  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v).toString();
    });
    return () => unsub();
  }, [spring]);
  return <span ref={ref}>0</span>;
}

export default function TeamStats() {
  const stats = [
    {
      label: "TI & Digitalisasi",
      count: teamMembers.filter((item) => item.bidang === "TI dan Digitalisasi").length,
    },
    {
      label: "Kewirausahaan",
      count: teamMembers.filter((item) => item.bidang === "Kewirausahaan").length,
    },
    {
      label: "Basis Data",
      count: teamMembers.filter((item) => item.bidang === "Basis Data").length,
    },
    {
      label: "Pendamping Lapangan",
      count: teamMembers.filter((item) => item.bidang === "Pendamping Lapangan").length,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 md:mt-20"
    >
      {stats.map((item) => (
        <motion.div
          key={item.label}
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(6px)", scale: 0.97 },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="border border-white dark:border-white/10 bg-light dark:bg-white/[0.03] rounded-xl backdrop-blur-sm p-3 sm:p-4 md:p-6 relative overflow-hidden group"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_70%)]" />
          <h3 className="relative text-3xl sm:text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
            <CountUp value={item.count} />
          </h3>
          <p className="relative mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-zinc-600 dark:text-white/60 leading-snug">
            {item.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
