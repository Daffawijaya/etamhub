"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapPin, Check, X } from "lucide-react";

import MapMarker from "./MapMarker";
import MapEvents from "./MapEvents";
import CurrentLocationButton from "./CurrentLocationButton";
import KukarBoundary from "@/components/map/KukarBoundary";

interface Props {
  latitude: string;
  longitude: string;
  onSave: (lat: number, lng: number) => void;
}

const DEFAULT_LAT = -0.4254;
const DEFAULT_LNG = 117.0026;

export default function LocationPicker({ latitude, longitude, onSave }: Props) {
  const { resolvedTheme } = useTheme();

  const [editing, setEditing] = useState(false);

  const [tempLat, setTempLat] = useState(Number(latitude) || DEFAULT_LAT);

  const [tempLng, setTempLng] = useState(Number(longitude) || DEFAULT_LNG);

  useEffect(() => {
    if (editing) return;

    setTempLat(Number(latitude) || DEFAULT_LAT);
    setTempLng(Number(longitude) || DEFAULT_LNG);
  }, [latitude, longitude, editing]);

  const position = useMemo(
    () => [tempLat, tempLng] as [number, number],
    [tempLat, tempLng],
  );

  function openEditor() {
    setTempLat(Number(latitude) || DEFAULT_LAT);
    setTempLng(Number(longitude) || DEFAULT_LNG);
    setEditing(true);
  }

  function cancel() {
    setTempLat(Number(latitude) || DEFAULT_LAT);
    setTempLng(Number(longitude) || DEFAULT_LNG);
    setEditing(false);
  }

  function save() {
    onSave(tempLat, tempLng);
    setEditing(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className="inline-flex items-center gap-2 rounded-lg bg-dark-card hover:bg-black dark:bg-button-gray dark:hover:bg-button-gray-hover pl-3 pr-4 py-2 font-medium text-white transition"
      >
        <MapPin size={18} />
        Pilih di Peta
      </button>

      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#121313]">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold">Pilih Lokasi UMKM</h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Geser marker atau klik pada peta.
                </p>
              </div>

              <button
                onClick={cancel}
                className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={22} />
              </button>
            </div>

            {/* MAP */}

            <div className="relative flex-1">
              <MapContainer
                center={position}
                zoom={15}
                zoomControl={false}
                attributionControl={false}
                className="h-full w-full"
              >
                <TileLayer
                  key={resolvedTheme}
                  url="https://{s}.google.com/vt/lyrs=m&apistyle=s.e:l.i|p.v:off&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  className={
                    resolvedTheme === "dark" ? "google-dark-tiles" : ""
                  }
                  maxZoom={20}
                />

                <KukarBoundary />

                <MapMarker
                  position={position}
                  onMove={(lat, lng) => {
                    setTempLat(lat);
                    setTempLng(lng);
                  }}
                />

                <MapEvents
                  position={position}
                  onChange={(lat, lng) => {
                    setTempLat(lat);
                    setTempLng(lng);
                  }}
                />

                <CurrentLocationButton
                  onLocation={(lat, lng) => {
                    setTempLat(lat);
                    setTempLng(lng);
                  }}
                />
              </MapContainer>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col gap-5 border-t border-zinc-200 p-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400">
                    Latitude
                  </div>

                  <div className="rounded-lg bg-zinc-100 px-3 py-2 font-mono dark:bg-zinc-900">
                    {tempLat.toFixed(6)}
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400">
                    Longitude
                  </div>

                  <div className="rounded-lg bg-zinc-100 px-3 py-2 font-mono dark:bg-zinc-900">
                    {tempLng.toFixed(6)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-lg px-4 py-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={save}
                  className="inline-flex items-center gap-2 rounded-lg bg-gre dark:bg-success px-4 py-2 font-medium text-white transition hover:opacity-90"
                >
                  <Check size={18} />
                  Simpan Lokasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
