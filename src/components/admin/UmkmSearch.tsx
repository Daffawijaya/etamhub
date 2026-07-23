"use client";

import { Search } from "lucide-react";

interface UmkmSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UmkmSearch({ value, onChange }: UmkmSearchProps) {
  return (
    <div className="relative w-100 max-w-md">
      <Search
        size={18}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          z-10
          -translate-y-1/2

          text-slate-400
          dark:text-slate-500

          transition-colors
          duration-300
        "
      />

      <input
        type="text"
        placeholder="Cari UMKM..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11
          w-full
          rounded-2xl

          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-dark

          pl-11
          pr-4

          text-sm

          text-slate-700
          dark:text-white

          placeholder:text-slate-400
          dark:placeholder:text-slate-500

          outline-none

          transition-all
          duration-300

          hover:border-slate-300
          dark:hover:border-slate-700

          focus:border-sky-500
          focus:ring-4
          focus:ring-sky-500/10
        "
      />
    </div>
  );
}
