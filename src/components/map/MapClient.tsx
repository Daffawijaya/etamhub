import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { useState } from "react";
import { umkms } from "@/data/umkm";
import UmkmMarker from "./UmkmMarker";
import UmkmMapCard from "./UmkmMapCard";
import UserLocation from "./UserLocation";
import { useTheme } from "next-themes";
import MapMyLocationButton from "./MapMyLocationButton";

export default function MapClient() {
  const [selectedUmkm, setSelectedUmkm] = useState<any>(null);
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative h-screen w-screen">
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

      <MapContainer
        center={[-0.4138, 116.9891]}
        zoom={10}
        attributionControl={false}
        zoomControl={false}
        className="h-screen w-screen"
      >
        <TileLayer
          key={resolvedTheme}
          url={
            resolvedTheme === "dark"
              ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          }
          attribution="&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap"
        />

        <UserLocation />

        <MapMyLocationButton />

        {umkms.map((umkm) => (
          <UmkmMarker
            key={umkm.id}
            lat={umkm.lat}
            lng={umkm.lng}
            nama={umkm.nama}
            kategori={umkm.kategori}
            subkategori={umkm.subkategori}
            // 🔥 TAMBAHAN: Kirim status aktif jika ID cocok dengan yang di-select
            isActive={selectedUmkm?.id === umkm.id}
            onClick={() => {
              setSelectedUmkm(null);

              requestAnimationFrame(() => {
                setSelectedUmkm(umkm);
              });
            }}
          />
        ))}

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
