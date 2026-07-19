"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  lat?: number;
  lng?: number;
};

export default function FlyToMarker({
  lat,
  lng,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;

    map.flyTo([lat, lng], 17, {
      duration: 1.5,
    });
  }, [lat, lng, map]);

  return null;
}