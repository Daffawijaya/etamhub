"use client";

import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { useState, useMemo } from "react";
import UmkmMapCard from "./UmkmMapCard";
import UserLocation from "./UserLocation";
import { useTheme } from "next-themes";
import MapMyLocationButton from "./MapMyLocationButton";
import KukarBoundary from "./KukarBoundary";
import MapSearch from "./MapSearch";
import MapSearchResults from "./MapSearchResults";
import FlyToMarker from "./FlyToMarker";
import MapMarkers from "./MapMarkers";
import type { Umkm } from "@/data/umkm";
import umkmsData from "@/data/umkm.json";

const umkms = umkmsData as Umkm[];

export default function MapClient() {
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
  const { resolvedTheme } = useTheme();

  const [search, setSearch] = useState("");
  const filteredUmkms = useMemo(() => {
    if (!search.trim()) return [];

    return umkms.filter((umkm) =>
      [umkm.nama, umkm.kategori, umkm.subkategori, umkm.kecamatan]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  return (
    <div className="relative h-full w-full">
      {/* Inject CSS Reset Global untuk Leaflet Popup di sini agar component lebih bersih */}
      <style>{`
        .custom-google-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-control-zoom {
          display: none !important;
        }
        .custom-google-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
          width: 270px !important; /* Samakan dengan lebar w-[270px] di UmkmMapCard */
        }
        /* 🔥 FIX UTAMA: Matikan paksaan margin & padding teks dari Leaflet */
        .custom-google-popup .leaflet-popup-content h3,
        .custom-google-popup .leaflet-popup-content p {
          margin: 0 !important;
          padding: 0 !important;
        }
        .custom-google-popup .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
      <MapSearch value={search} onChange={setSearch} />

      <MapSearchResults
        search={search}
        results={filteredUmkms}
        onSelect={(umkm) => {
          setSelectedUmkm(umkm);

          setFlyTarget({
            lat: umkm.lat,
            lng: umkm.lng,
          });

          setSearch("");
        }}
      />
      <MapContainer
        center={[-0.4138, 116.9891]}
        maxBounds={[
          [-1.25, 115.1], // bawah, kiri
          [1.7, 117.9], // atas, kanan
        ]}
        zoom={10}
        attributionControl={false}
        zoomControl={false}
        className="relative h-full w-full"
      >
        <TileLayer
          key={resolvedTheme}
          url="https://{s}.google.com/vt/lyrs=m&apistyle=s.e:l.i|p.v:off&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          className={resolvedTheme === "dark" ? "google-dark-tiles" : ""}
          maxZoom={20}
        />

        <UserLocation />

        <MapMyLocationButton />

        <KukarBoundary />

        <FlyToMarker lat={flyTarget?.lat} lng={flyTarget?.lng} />

        <MapMarkers
          data={
            filteredUmkms.length > 0 || search.trim() ? filteredUmkms : umkms
          }
          selectedUmkm={selectedUmkm}
          setSelectedUmkm={setSelectedUmkm}
        />

        {selectedUmkm && (
          <Popup
            key={selectedUmkm.id}
            position={[selectedUmkm.lat, selectedUmkm.lng]}
            closeButton={false}
            autoPan
            className="custom-google-popup"
            offset={[0, -10]}
            // 🔥 FIX: Gunakan eventHandlers untuk mendeteksi saat popup tertutup/dihapus
            eventHandlers={{
              remove: () => setSelectedUmkm(null),
            }}
          >
            <UmkmMapCard {...selectedUmkm} />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
