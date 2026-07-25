"use client";

import { useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";

interface Props {
  position: [number, number];

  onChange: (lat: number, lng: number) => void;
}

export default function MapEvents({ position, onChange }: Props) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 0.5,
    });
  }, [position, map]);

  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
