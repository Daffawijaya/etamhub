"use client";
import { useState, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

type UmkmMarkerProps = {
  lat: number;
  lng: number;
  nama: string;
  kategori: string;
  subkategori?: string;
  isActive: boolean;
  onClick: () => void;
  defaultTextPosition?: "left" | "right";
};

// Konfigurasi Warna & Ikon
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

// ==========================================
// 🎨 INJEKSI CSS ANIMASI KEYFRAMES
// ==========================================
const ANIMATION_STYLE_ID = "leaflet-marker-animations";

function injectMarkerStyles() {
  if (
    typeof window !== "undefined" &&
    !document.getElementById(ANIMATION_STYLE_ID)
  ) {
    const style = document.createElement("style");
    style.id = ANIMATION_STYLE_ID;
    style.innerHTML = `
      .umkm-pin-wrapper {
        position: relative;
        width: 26px;
        height: 32px;
        /* Titik tumpu animasi persis di ujung bawah pin */
        transform-origin: bottom center; 
      }
      
      /* Animasi HANYA saat marker diklik (Melompat & Membesar) */
      .umkm-pin-active {
        animation: pinSelect 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        z-index: 1000;
      }
      
      @keyframes pinSelect {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-12px) scale(1.15); }
        100% { transform: translateY(-8px) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==========================================
// 📍 FUNGSI PEMBUAT IKON
// ==========================================
function createIcon(
  kategori: string,
  nama: string,
  isActive: boolean,
  textPosition: "left" | "right",
) {
  const textPositionStyle =
    textPosition === "right" ? "left: 32px;" : "right: 32px;";

  if (isActive) {
    // 🔴 TAMPILAN AKTIF (MERAH) - Diberi class .umkm-pin-active
    return L.divIcon({
      className: "",
      iconSize: [26, 32],
      iconAnchor: [13, 32],
      html: `
        <div class="umkm-pin-wrapper umkm-pin-active">
          <!-- TEKS DINAMIS (Warna Merah) -->
          <div style="
            position: absolute;
            ${textPositionStyle}
            top: 13px;
            transform: translateY(-50%);
            color: #C5221F;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            -webkit-text-stroke: 3px white;
            paint-order: stroke fill;
            z-index: 1001;
          ">
            ${nama}
          </div>
          <!-- PIN UTAMA MERAH -->
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.4)); display: block;">
            <path d="M13 0 C5.8 0 0 5.8 0 13 c0 6 7 14 10 16.5 a4 4 0 0 0 6 0 c3-2.5 10-10.5 10-16.5 C26 5.8 20.2 0 13 0 Z" fill="#EA4335"/>
            <circle cx="13" cy="11" r="4.5" fill="#8B0000"/>
          </svg>
        </div>
      `,
    });
  }

  // 🟢 TAMPILAN DEFAULT (BELUM AKTIF) - Tanpa class animasi
  const { color, svg } = MARKER_CONFIG[kategori] || {
    color: "#10B981", // Hijau Default
    svg: `<path d="M2 7h20M4 7V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 22V12h6v10"/>`,
  };

  return L.divIcon({
    className: "",
    iconSize: [26, 32],
    iconAnchor: [13, 32],
    html: `
      <div class="umkm-pin-wrapper">
        <!-- TEKS DINAMIS -->
        <div style="
          position: absolute;
          ${textPositionStyle}
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
        <!-- PIN UTAMA -->
        <svg width="26" height="32" viewBox="0 0 26 32" fill="none" style="filter: drop-shadow(0px 1px 3px rgba(0,0,0,0.25)); display: block;">
          <path d="M13 0 C5.8 0 0 5.8 0 13 c0 6 7 14 10 16.5 a4 4 0 0 0 6 0 c3-2.5 10-10.5 10-16.5 C26 5.8 20.2 0 13 0 Z" fill="white"/>
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

// ==========================================
// 🧩 KOMPONEN UTAMA
// ==========================================
export default function UmkmMarker({
  lat,
  lng,
  nama,
  kategori,
  isActive,
  onClick,
  defaultTextPosition = "right",
}: UmkmMarkerProps) {
  const map = useMap();
  const [textPos, setTextPos] = useState<"left" | "right">(defaultTextPosition);

  // Injeksi CSS keyframes hanya sekali saat komponen dipanggil
  useEffect(() => {
    injectMarkerStyles();
  }, []);

  // Mencegah teks terpotong di tepi layar
  useEffect(() => {
    const handleReposition = () => {
      const containerPoint = map.latLngToContainerPoint([lat, lng]);

      if (containerPoint.x < 80) {
        setTextPos("right");
      } else if (containerPoint.x > map.getSize().x - 120) {
        setTextPos("left");
      } else {
        setTextPos(defaultTextPosition);
      }
    };

    handleReposition();
    map.on("move", handleReposition);
    map.on("zoom", handleReposition);

    return () => {
      map.off("move", handleReposition);
      map.off("zoom", handleReposition);
    };
  }, [map, lat, lng, defaultTextPosition]);

  return (
    <Marker
      position={[lat, lng]}
      icon={createIcon(kategori, nama, isActive, textPos)}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
