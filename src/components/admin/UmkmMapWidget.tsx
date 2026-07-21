"use client";

import dynamic from "next/dynamic";

const MapWidget = dynamic(() => import("@/components/map/MapWidget"), {
  ssr: false,
});

export default function UmkmMapWidget() {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="text-lg font-semibold">Peta Sebaran UMKM</h3>
      </div>

      <div className="h-[327px]">
        <MapWidget />
      </div>
    </div>
  );
}
