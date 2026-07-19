"use client";

import { Search } from "lucide-react";

type MapSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function MapSearch({ value, onChange }: MapSearchProps) {
  return (
    <div className="absolute top-14 lg:top-19 xl:top-5 px-4 flex justify-center xl:justify-start w-screen z-[1001]">
      <div
        className="
        h-11
        w-90
        rounded-full
        bg-white
        dark:bg-dark
        border
        shadow
        border-white
        dark:border-white/10
        px-5
        flex
        items-center
      "
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Telusuri UMKM Kukar"
          className="
          flex-1
          bg-transparent
          outline-none
          text-xs
          md:text-sm
          text-black
          dark:text-white
          placeholder:text-black/50
          dark:placeholder:text-white/50
        "
        />

        <Search size={20} className="text-black/60 dark:text-white/60" />
      </div>
    </div>
  );
}
