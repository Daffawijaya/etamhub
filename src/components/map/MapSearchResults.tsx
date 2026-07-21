"use client";

import umkms from "@/data/umkm.json";

type Umkm = (typeof umkms)[number];

type Props = {
  search: string;
  results: Umkm[];
  onSelect: (umkm: Umkm) => void;
};

export default function MapSearchResults({ search, results, onSelect }: Props) {
  if (!search.trim()) return null;

  return (
    <div className="absolute top-27 lg:top-32 xl:top-18 px-4 flex justify-center xl:justify-start w-screen z-[1001]">
      <div
        className="
      w-90
      z-[1001]
      overflow-hidden
      rounded-3xl
      bg-white
      dark:bg-dark
      shadow
      py-2
      border
      border-white
      dark:border-white/10
      max-h-[68vh]
      overflow-y-auto
      [scrollbar-width:none]
  [-ms-overflow-style:none]
  [&::-webkit-scrollbar]:hidden
  space-y-3
      "
      >
        {results.length === 0 && (
          <div className="text-xs px-4 py-1 md:text-sm text-black/60 dark:text-white/60">
            Tidak ada hasil ditemukan
          </div>
        )}

        {results.slice(0, 20).map((umkm) => (
          <button
            key={umkm.id}
            onClick={() => onSelect(umkm)}
            className="
          w-full
          text-left
          px-4
          py-1
          hover:bg-black/5
          dark:hover:bg-white/5
          transition
          "
          >
            <p className="text-sm md:text- font-medium text-black dark:text-white">
              {umkm.nama}
            </p>

            <p className="text-xs md:text-sm text-black/60 dark:text-white/60">
              {umkm.subkategori}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
