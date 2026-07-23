"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:#3b82f6;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 10px rgba(0,0,0,.3);
    "></div>
  `,
  iconSize: [18, 18],
});

function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(coords, 15, {
      animate: true,
      duration: 1.5,
    });
  }, [coords, map]);

  return null;
}

export default function UserLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  if (!position) return null;

  return (
    <>
      <ChangeView coords={position} />

      <Marker position={position} icon={userIcon}>
        <Popup>Lokasi saya</Popup>
      </Marker>
    </>
  );
}
