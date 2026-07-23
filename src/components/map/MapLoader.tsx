"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/data/umkm";

const MapClient = dynamic(() => import("@/components/map/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-light-bg dark:bg-dark">
      <p className="text-zinc-500">Memuat peta...</p>
    </div>
  ),
});

interface Props {
  umkms: Umkm[];
}

export default function MapLoader({ umkms }: Props) {
  return <MapClient umkms={umkms} />;
}
