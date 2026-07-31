"use client";

import { useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";

interface Props {
  onLocation: (lat: number, lng: number) => void;
}

export default function CurrentLocationButton({ onLocation }: Props) {
  const map = useMap();

  function getLocation() {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        onLocation(lat, lng);

        map.flyTo([lat, lng], 17, {
          animate: true,
        });
      },
      () => {
        alert("Gagal mendapatkan lokasi.");
      },
      {
        enableHighAccuracy: true,
      },
    );
  }

  return (
    <button
      type="button"
      onClick={getLocation}
      className="
      absolute
      right-4
      top-4
      z-[1000]
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      bg-white
      dark:bg-dark-card
      dark:text-white
      text-black
      shadow-lg
      hover:bg-gray-100
      dark:hover:bg-dark
      "
    >
      <LocateFixed size={20} />
    </button>
  );
}
