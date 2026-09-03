"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
};

export default function NewsSearch({ value, onChange, onSearch }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[800px] mt-8 md:mt-12 xl:mt-16 relative"
    >
      {/* Border Gradien dengan Noise */}
      <div
        className="
          absolute
          inset-0
          rounded-2xl
          bg-gradient-to-r
          from-[#b8b8c8]
          via-[#d9b5ca]
          to-[#b8b8c8]
          shadow-[0_4px_30px_rgba(0,0,0,0.08)]
        "
      >
        {/* Tekstur Noise Khusus di Border Search Bar */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay rounded-2xl pointer-events-none"
          style={{
            backgroundImage: "url('/grian.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        />
      </div>
      <div
        className="
          relative
          z-10
          flex
          items-center
          bg-[#ebebf4]
          backdrop-blur-md
          rounded-xl
          m-[4px] md:m-[6px]
          w-[calc(100%-8px)] md:w-[calc(100%-12px)]
          h-[56px] md:h-[68px]
          pr-[4px] md:pr-[7px]
          pl-4 md:pl-6
        "
      >
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch?.();
            }
          }}
          placeholder="Cari berita"
          className="
            flex-1
            w-full
            bg-transparent
            border-none
            outline-none
            text-gray-900
            placeholder-gray-500
            text-base md:text-lg
          "
        />

        <motion.button
          type="button"
          onClick={onSearch}
          aria-label="Search"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="flex-shrink-0 bg-[#111111] rounded-lg flex items-center justify-center text-white hover:bg-black transition-colors w-10 h-10 md:w-13 md:h-13"
        >
          <Search size={20} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>
    </motion.div>
  );
}
