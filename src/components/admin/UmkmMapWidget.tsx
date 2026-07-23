"use client";

import dynamic from "next/dynamic";

const MapWidget = dynamic(() => import("@/components/map/MapWidget"), {
  ssr: false,
});

export default function UmkmMapWidget() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-semibold">
          Peta Sebaran UMKM
        </h2>
      </div>

      <div className="p-0">
        <div className="h-[320px]">
          <MapWidget />
        </div>
      </div>
    </div>
  );
}