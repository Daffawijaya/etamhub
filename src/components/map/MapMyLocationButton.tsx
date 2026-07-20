"use client";

import { LocateFixed } from "lucide-react";
import { useMap } from "react-leaflet";

export default function MapMyLocationButton() {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        map.flyTo([lat, lng], 16, {
          duration: 1.5,
        });
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  return (
    <button
      onClick={handleLocate}
      className="
        fixed bottom-5
        right-5
        z-[99999]
pointer-events-auto
        h-12
        w-12
        rounded-full
        bg-white
        dark:bg-zinc-900
        border
        border-zinc-200
        dark:border-zinc-700
        shadow-lg
        flex
        items-center
        justify-center
        transition-all
        hover:scale-105
        active:scale-95
      "
      aria-label="Lokasi Saya"
    >
      <LocateFixed size={20} />
    </button>
  );
}
