"use client";

import dynamic from "next/dynamic";
import umkms from "@/data/umkm.json";

const MapClient = dynamic(() => import("../map/MapClient"), {
  ssr: false,
});

export default function UmkmMapWidget() {
  const totalUmkm = umkms.length;
  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white dark:border-white/10 dark:bg-[#181818]">
      <div className="relative z-10 border-b border-black/5 p-6 dark:border-white/10">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Peta UMKM
        </h2>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {totalUmkm} Marker • {totalKecamatan} Kecamatan
        </p>
      </div>

      <div className="relative z-0 h-[550px]">
        <MapClient />
      </div>
    </section>
  );
}
