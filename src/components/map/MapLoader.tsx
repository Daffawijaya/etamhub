"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/map/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-light-bg dark:bg-dark">
      <p className="text-zinc-500">Memuat peta...</p>
    </div>
  ),
});

export default function MapLoader() {
  return <MapClient />;
}
