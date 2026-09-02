"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-black dark:text-white text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight leading-[1.15] pb-2"
      >
        {/* title word stagger subtle */}
        {title.split(" ").map((word, i) => (
          <motion.span
            key={word + i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mr-[0.22em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-center text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
