"use client";

import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import type { Umkm } from "@/data/umkm";
import UmkmMarker from "./UmkmMarker";

type Props = {
  data: Umkm[];
  selectedUmkm: Umkm | null;
  setSelectedUmkm: React.Dispatch<React.SetStateAction<Umkm | null>>;
};

function getMinPixelDistance(zoom: number) {
  if (zoom >= 17) return 0;
  if (zoom >= 15) return 25;
  if (zoom >= 13) return 35;
  if (zoom >= 11) return 45;

  return 60;
}

export default function MapMarkers({
  data,
  selectedUmkm,
  setSelectedUmkm,
}: Props) {
  const map = useMap();

  const [zoom, setZoom] = useState(map.getZoom());
  const [boundsVersion, setBoundsVersion] = useState(0);

  useEffect(() => {
    const update = () => {
      setZoom(map.getZoom());
      setBoundsVersion((v) => v + 1);
    };

    map.on("zoomend", update);
    map.on("moveend", update);

    return () => {
      map.off("zoomend", update);
      map.off("moveend", update);
    };
  }, [map]);

  const visibleUmkms = useMemo(() => {
    const bounds = map.getBounds();

    const candidates = data.filter((umkm) =>
      bounds.contains([umkm.lat, umkm.lng]),
    );

    const minPixelDistance = getMinPixelDistance(zoom);

    if (minPixelDistance === 0) {
      return candidates;
    }

    const visible: Umkm[] = [];

    for (const umkm of candidates) {
      const point = map.latLngToContainerPoint([umkm.lat, umkm.lng]);

      const overlaps = visible.some((selected) => {
        const selectedPoint = map.latLngToContainerPoint([
          selected.lat,
          selected.lng,
        ]);

        return point.distanceTo(selectedPoint) < minPixelDistance;
      });

      if (!overlaps) {
        visible.push(umkm);
      }
    }

    return visible;
  }, [data, map, zoom, boundsVersion]);

  return (
    <>
      {visibleUmkms.map((umkm) => (
        <UmkmMarker
          key={umkm.id}
          lat={umkm.lat}
          lng={umkm.lng}
          nama={umkm.nama}
          kategori={umkm.kategori}
          subkategori={umkm.subkategori}
          isActive={selectedUmkm?.id === umkm.id}
          onClick={() => setSelectedUmkm(umkm)}
        />
      ))}
    </>
  );
}
