"use client";

import { Marker } from "react-leaflet";
import { LatLngExpression, DivIcon, DragEndEvent } from "leaflet";
import { useMemo } from "react";
import L from "leaflet";

interface Props {
  position: LatLngExpression;
  onMove: (lat: number, lng: number) => void;

  // opsional kalau nanti mau tampil nama
  label?: string;
  labelPosition?: "left" | "right";
}

function createMarker(
  label?: string,
  labelPosition: "left" | "right" = "right",
): DivIcon {
  const textPositionClass =
    labelPosition === "left" ? "right-[34px] text-right" : "left-[34px]";

  return L.divIcon({
    className: "",
    iconSize: [26, 32],
    iconAnchor: [13, 32],

    html: `
      <div class="relative w-[26px] h-[32px]">

        ${
          label
            ? `
          <div
            class="
              absolute
              ${textPositionClass}
              top-[13px]
              -translate-y-1/2
              whitespace-nowrap
              text-[14px]
              font-semibold
              z-[1001]
              text-[#C5221F]
              dark:text-[#F87171]
              [paint-order:stroke_fill]
              [-webkit-text-stroke:3px_white]
              dark:[-webkit-text-stroke:3px_#1A1D24]
            "
          >
            ${label}
          </div>
        `
            : ""
        }

        <svg
          width="26"
          height="32"
          viewBox="0 0 26 32"
          fill="none"
          class="block drop-shadow-md"
        >
          <path
            d="M13 0
               C5.8 0 0 5.8 0 13
               c0 6 7 14 10 16.5
               a4 4 0 0 0 6 0
               c3-2.5 10-10.5 10-16.5
               C26 5.8 20.2 0 13 0 Z"
            fill="#EA4335"
          />

          <circle
            cx="13"
            cy="11"
            r="4.5"
            fill="#8B0000"
          />
        </svg>

      </div>
    `,
  });
}

export default function MapMarker({
  position,
  onMove,
  label,
  labelPosition = "right",
}: Props) {
  const icon = useMemo(
    () => createMarker(label, labelPosition),
    [label, labelPosition],
  );

  const eventHandlers = useMemo(
    () => ({
      dragend(event: DragEndEvent) {
        const marker = event.target;

        const { lat, lng } = marker.getLatLng();

        onMove(lat, lng);
      },
    }),
    [onMove],
  );

  return (
    <Marker
      draggable
      position={position}
      icon={icon}
      eventHandlers={eventHandlers}
    />
  );
}
