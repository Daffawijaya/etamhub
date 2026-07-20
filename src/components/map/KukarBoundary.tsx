"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

const createInvertedMask = (geojsonData: any) => {
  const worldRing = [
    [-180, -90],
    [-180, 90],
    [180, 90],
    [180, -90],
    [-180, -90],
  ];

  const holes: any[] = [];

  const extractHoles = (geometry: any) => {
    if (!geometry) return;
    if (geometry.type === "Polygon") {
      holes.push(geometry.coordinates[0]);
    } else if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((poly: any) => {
        holes.push(poly[0]);
      });
    }
  };

  if (geojsonData.type === "FeatureCollection") {
    geojsonData.features.forEach((f: any) => extractHoles(f.geometry));
  } else if (geojsonData.type === "Feature") {
    extractHoles(geojsonData.geometry);
  } else {
    extractHoles(geojsonData);
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [worldRing, ...holes],
        },
      },
    ],
  };
};

export default function KukarBoundary() {
  const [geojson, setGeojson] = useState<any>(null);
  const [maskGeojson, setMaskGeojson] = useState<any>(null);

  useEffect(() => {
    fetch("/geojson/kukar.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeojson(data);
        setMaskGeojson(createInvertedMask(data));
      })
      .catch((err) => console.error("GeoJSON error:", err));
  }, []);

  if (!geojson || !maskGeojson) return null;

  return (
    <>
      {/* Layer 1: Mask Luar (Slate Navy Minimalis) */}
      <GeoJSON
        data={maskGeojson}
        style={{
          fillColor: "#0f172a", // Warna Slate-900 (lebih elegan dari hitam pekat #000000)
          fillOpacity: 0.55, // Transparansi pas agar peta luar tetap samar terlihat
          weight: 0,
          stroke: false,
          interactive: false, // Mencegah kursor berubah jadi 'pointer' saat hover area luar
        }}
      />

      {/* Layer 2: Outer Glow / Shadow Line (Rahasia efek smooth ala Google) */}
      <GeoJSON
        data={geojson}
        style={{
          color: "#ffffff",
          weight: 5,
          opacity: 0.5,
          lineCap: "round",
          lineJoin: "round",
          fillOpacity: 0,
          interactive: false,
        }}
      />

      {/* Layer 3: Main Border (Garis Utama yang Tegas dan Modern) */}
      <GeoJSON
        data={geojson}
        style={{
          color: "#3b82f6", // Warna Biru Modern ala Google Maps (Ganti "#ef4444" jika tetap ingin merah)
          weight: 2.5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          fillOpacity: 0,
        }}
      />
    </>
  );
}
