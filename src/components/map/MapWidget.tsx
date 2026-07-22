"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import umkms from "@/data/umkm.json";
import MapMarkers from "./MapMarkers";
import { useTheme } from "next-themes";
import KukarBoundary from "./KukarBoundary";

export default function MapWidget() {
  const { resolvedTheme } = useTheme();
  return (
    <MapContainer
      center={[-0.4138, 116.9891]}
      zoom={10}
      zoomControl={false}
      attributionControl={false}
      dragging={true}
      scrollWheelZoom={true}
      doubleClickZoom={false}
      touchZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        key={resolvedTheme}
        url="https://{s}.google.com/vt/lyrs=m&apistyle=s.e:l.i|p.v:off&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
        className={resolvedTheme === "dark" ? "google-dark-tiles" : ""}
        maxZoom={20}
      />
      <KukarBoundary />
      <MapMarkers data={umkms} selectedUmkm={null} setSelectedUmkm={() => {}} />
    </MapContainer>
  );
}
