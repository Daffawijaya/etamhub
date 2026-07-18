import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { useState } from "react";
import { umkms } from "@/data/umkm";
import UmkmMarker from "./UmkmMarker";
import UmkmMapCard from "./UmkmMapCard";
import UserLocation from "./UserLocation";

export default function MapClient() {
  const [selectedUmkm, setSelectedUmkm] = useState<any>(null);

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
        zoomControl={false}
        className="h-screen w-screen"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserLocation />

        {umkms.map((umkm) => (
          <UmkmMarker
            key={umkm.id}
            lat={umkm.lat}
            lng={umkm.lng}
            nama={umkm.nama}
            kategori={umkm.kategori}
            subkategori={umkm.subkategori}
            onClick={() => setSelectedUmkm(umkm)}
          />
        ))}

        {selectedUmkm && (
          <Popup
            position={[selectedUmkm.lat, selectedUmkm.lng]}
            closeButton={false}
            autoPan={true}
            className="custom-google-popup"
            offset={[0, -10]}
          >
            <UmkmMapCard {...selectedUmkm} />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
