"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";

type UmkmMarkerProps = {
  lat: number;
  lng: number;
  nama: string;
  kategori: string;
  subkategori: string;
  onClick: () => void;
};

// Konfigurasi Warna & Ikon (Sengaja dibuat ringkas ala Google Maps & Lucide Icons)
const MARKER_CONFIG: Record<string, { color: string; svg: string }> = {
  Jasa: {
    color: "#8B5CF6", // Ungu
    svg: `<rect width="20" height="14" x="2" y="6" rx="2"/><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  },
  Industri: {
    color: "#F59E0B", // Kuning/Amber
    svg: `<path d="M2 20h20M20 18v-4l-5 2v-4l-5 2V7l-5 3v8"/>`,
  },
};

function createIcon(kategori: string, nama: string) {
  // Jika kategori tidak terdaftar, otomatis pakai default Hijau Toko
  const { color, svg } = MARKER_CONFIG[kategori] || {
    color: "#10B981",
    svg: `<path d="M2 7h20M4 7V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 22V12h6v10"/>`,
  };

  return L.divIcon({
    className: "",
    iconSize: [26, 32], // Ukuran pin Google Maps (Lebih kecil & pas)
    iconAnchor: [13, 32], // Koordinat tumpuan tepat di ujung bawah lancip pin

    html: `
      <div style="position: relative; width: 26px; height: 32px;">
        
        <!-- TEKS DI SEBELAH KIRI (Font tipis/medium dengan stroke tipis rapi) -->
        <div style="
          position: absolute;
          right: 32px;
          top: 13px;
          transform: translateY(-50%);
          color: ${color};
          font-family: 'Inter', 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          -webkit-text-stroke: 3px white;
          paint-order: stroke fill;
        ">
          ${nama}
        </div>

        <!-- PIN UTAMA (Bentuk drop-pin mikro Google Maps dengan bayangan halus) -->
        <svg width="26" height="32" viewBox="0 0 26 32" fill="none" style="filter: drop-shadow(0px 1px 3px rgba(0,0,0,0.25)); display: block;">
          <path d="M13 32C13 32 26 22.4 26 13C26 5.8 20.2 0 13 0C5.8 0 0 5.8 0 13C0 22.4 13 32 13 32Z" fill="white"/>
        </svg>
        
        <!-- BULATAN WARNA DI DALAM PIN -->
        <div style="
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        ">
          <!-- IKON LINE ART MIKRO -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${svg}
          </svg>
        </div>

      </div>
    `,
  });
}

export default function UmkmMarker({
  lat,
  lng,
  nama,
  kategori,
  onClick,
}: UmkmMarkerProps) {
  return (
    <Marker
      position={[lat, lng]}
      icon={createIcon(kategori, nama)}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
