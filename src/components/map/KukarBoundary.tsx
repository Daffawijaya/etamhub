"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

export default function KukarBoundary() {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    console.log("KukarBoundary mounted");

    fetch("/geojson/kukar.geojson")
      .then((res) => {
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("GeoJSON loaded:", data);
        setGeojson(data);
      })
      .catch((err) => console.error("GeoJSON error:", err));
  }, []);

  if (!geojson) return null;

  return (
    <GeoJSON
      data={geojson}
      style={{
        color: "red",
        weight: 1,
        opacity: 0.7,
        dashArray: "4 6",
        fillOpacity: 0,
      }}
    />
  );
}
