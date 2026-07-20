import type { Map } from "leaflet";
import type { Umkm } from "@/data/umkm";

function getMinPixelDistance(zoom: number) {
  if (zoom >= 17) return 0;
  if (zoom >= 15) return 30;
  if (zoom >= 13) return 40;
  if (zoom >= 11) return 50;

  return 60;
}

export function getVisibleUmkms(
  map: Map,
  umkms: Umkm[],
  zoom: number,
) {
  const bounds = map.getBounds();

  const candidates = umkms.filter((umkm) =>
    bounds.contains([umkm.lat, umkm.lng]),
  );

  const minPixelDistance = getMinPixelDistance(zoom);

  if (minPixelDistance === 0) {
    return candidates;
  }

  const visible: Umkm[] = [];

  for (const umkm of candidates) {
    const point = map.latLngToContainerPoint([
      umkm.lat,
      umkm.lng,
    ]);

    const overlaps = visible.some((selected) => {
      const selectedPoint = map.latLngToContainerPoint([
        selected.lat,
        selected.lng,
      ]);

      return (
        point.distanceTo(selectedPoint) <
        minPixelDistance
      );
    });

    return !overlaps;
  }

  return candidates.filter((umkm) => {
    const point = map.latLngToContainerPoint([
      umkm.lat,
      umkm.lng,
    ]);

    const overlaps = visible.some((selected) => {
      const selectedPoint = map.latLngToContainerPoint([
        selected.lat,
        selected.lng,
      ]);

      return (
        point.distanceTo(selectedPoint) <
        minPixelDistance
      );
    });

    if (!overlaps) {
      visible.push(umkm);
      return true;
    }

    return false;
  });
}