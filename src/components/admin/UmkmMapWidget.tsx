"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/data/umkm";

const MapWidget = dynamic(() => import("@/components/map/MapWidget"), {
  ssr: false,
});

interface Props {
  umkms: Umkm[];
}

export default function UmkmMapWidget({ umkms }: Props) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        bg-white
        dark:bg-dark-card
        transition-colors
        duration-300
      "
    >
      <div className="p-6">
        <h2
          className="
            text-lg
            font-semibold
            text-gray-900
            dark:text-white
            transition-colors
            duration-300
          "
        >
          Peta Sebaran UMKM
        </h2>
      </div>

      <div className="p-0">
        <div className="h-[328px]">
          <MapWidget umkms={umkms} />
        </div>
      </div>
    </div>
  );
}
