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
const MARKER_CONFIG: Record<
  string,
  { color: string; darkColor: string; svg: string }
> = {
  Jasa: {
    color: "#8B5CF6", // Ungu
    darkColor: "#C4B5FD", // Ungu Kusam/Pastel untuk Dark Mode
    svg: `<rect width="20" height="14" x="2" y="6" rx="2"/><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  },
  Industri: {
    color: "#F59E0B", // Kuning/Amber
    darkColor: "#FCD34D", // Kuning Kusam/Pastel untuk Dark Mode
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
        transform-origin: bottom center; 
      }
      
      .umkm-pin-active {
        animation: pinSelect 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        z-index: 1000;
      }
      
      @keyframes pinSelect {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-6px) scale(1.15); }
        100% { transform: translateY(-0px) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==========================================
// 📍 FUNGSI PEMBUAT IKON (TAILWIND UTILITY)
// ==========================================
function createIcon(
  kategori: string,
  nama: string,
  isActive: boolean,
  textPosition: "left" | "right",
) {
  // Kelas Tailwind untuk posisi teks
  const textPositionClass =
    textPosition === "right" ? "left-[32px]" : "right-[32px]";

  if (isActive) {
    // 🔴 TAMPILAN AKTIF (MERAH)
    return L.divIcon({
      className: "",
      iconSize: [26, 32],
      iconAnchor: [13, 32],
      html: `
        <div class="umkm-pin-wrapper umkm-pin-active">
          <!-- TEKS DINAMIS -->
          <div class="absolute ${textPositionClass} top-[13px] -translate-y-1/2 text-[14px] font-semibold whitespace-nowrap z-[1001] [paint-order:stroke_fill] text-[#C5221F] dark:text-[#F87171] [-webkit-text-stroke:3px_white] dark:[-webkit-text-stroke:3px_#1A1D24]">
            ${nama}
          </div>
          <!-- PIN UTAMA MERAH -->
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none" class="block drop-shadow-md">
            <path d="M13 0 C5.8 0 0 5.8 0 13 c0 6 7 14 10 16.5 a4 4 0 0 0 6 0 c3-2.5 10-10.5 10-16.5 C26 5.8 20.2 0 13 0 Z" fill="#EA4335"/>
            <circle cx="13" cy="11" r="4.5" fill="#8B0000"/>
          </svg>
        </div>
      `,
    });
  }

  // 🟢 TAMPILAN DEFAULT (BELUM AKTIF)
  const { color, darkColor, svg } = MARKER_CONFIG[kategori] || {
    color: "#10B981", // Hijau Default
    darkColor: "#6EE7B7", // Hijau Kusam/Pastel untuk Dark Mode
    svg: `<path d="M2 7h20M4 7V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 22V12h6v10"/>`,
  };

  return L.divIcon({
    className: "",
    iconSize: [26, 32],
    iconAnchor: [13, 32],
    html: `
      <!-- Bungkus dengan style CSS variable agar Tailwind bisa membaca warnanya -->
      <div class="umkm-pin-wrapper" style="--cat-color: ${color}; --cat-dark-color: ${darkColor};">
        
        <!-- TEKS DINAMIS -->
        <div class="absolute ${textPositionClass} top-[13px] -translate-y-1/2 text-[12px] font-medium whitespace-nowrap [paint-order:stroke_fill] text-[var(--cat-color)] dark:text-[var(--cat-dark-color)] [-webkit-text-stroke:3px_white] dark:[-webkit-text-stroke:3px_#1A1D24]">
          ${nama}
        </div>

        <!-- PIN UTAMA (Luar) -->
        <svg width="26" height="32" viewBox="0 0 26 32" fill="none" class="block drop-shadow-sm">
          <path d="M13 0 C5.8 0 0 5.8 0 13 c0 6 7 14 10 16.5 a4 4 0 0 0 6 0 c3-2.5 10-10.5 10-16.5 C26 5.8 20.2 0 13 0 Z" class="fill-white dark:fill-[#6e7c97] transition-colors"/>
        </svg>
        
        <!-- BULATAN WARNA DI DALAM PIN -->
        <div class="absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full flex items-center justify-center z-10 transition-colors bg-[var(--cat-color)] dark:bg-[var(--cat-dark-color)]">
          <!-- IKON LINE ART MIKRO -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="stroke-white dark:stroke-[#1A1D24] transition-colors">
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
