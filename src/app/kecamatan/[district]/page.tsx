"use client";

import { useMemo, useState, use, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/UmkmCard";
import KategoriFilter from "@/components/KategoriFilter";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";

type Props = {
  params: Promise<{
    district: string;
  }>;
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function KecamatanPage({ params }: Props) {
  const { district } = use(params);

  const [kategori, setKategori] = useState("Semua");

  const [urutTerdekat, setUrutTerdekat] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!urutTerdekat) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        alert("Gagal mendapatkan lokasi pengguna.");
      },
    );
  }, [urutTerdekat]);

  const data = umkms.filter((item) => slugify(item.kecamatan) === district);

  const filteredData = useMemo(() => {
    let hasil = [...data];

    if (kategori !== "Semua") {
      hasil = hasil.filter((item) => item.kategori === kategori);
    }

    const dataDenganJarak = hasil.map((item) => {
      let distance: number | null = null;

      if (userLocation && item.lat && item.lng) {
        distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          item.lat,
          item.lng,
        );
      }

      return {
        ...item,
        distance,
      };
    });

    if (urutTerdekat && userLocation) {
      // Urut berdasarkan jarak terdekat
      dataDenganJarak.sort(
        (a, b) => (a.distance ?? 999999) - (b.distance ?? 999999),
      );
    } else {
      // Urut nama A-Z
      dataDenganJarak.sort((a, b) =>
        a.nama.localeCompare(b.nama, "id", {
          sensitivity: "base",
        }),
      );
    }

    return dataDenganJarak;

    return dataDenganJarak;
  }, [data, kategori, urutTerdekat, userLocation]);

  const districtName = (data[0]?.kecamatan ?? district ?? "Tidak Diketahui")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const categories = ["Semua", "Jasa", "Industri", "Perdagangan"];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 pt-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Dashboard
          </Link>

          <span>›</span>

          <span className="font-medium text-primary">{districtName}</span>
        </nav>

        {/* Header */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-900">
            UMKM Kecamatan {districtName}
          </h1>

          <p className="mt-2 text-slate-500">
            Menampilkan seluruh UMKM yang terdaftar di Kecamatan {districtName}.
          </p>
        </div>

        {/* Mobile Filter */}
        <div className="mt-6 lg:hidden space-y-3">
          {/* Filter Kategori */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((item) => {
              const active = kategori === item;

              return (
                <button
                  key={item}
                  onClick={() => setKategori(item)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Tombol Terdekat */}
          <button
            onClick={() => setUrutTerdekat(!urutTerdekat)}
            className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              urutTerdekat
                ? "bg-emerald-600 text-white"
                : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            📍{" "}
            {urutTerdekat ? "Lokasi Terdekat Aktif" : "Urutkan Lokasi Terdekat"}
          </button>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredData.length}
                  </span>{" "}
                  UMKM
                </p>

                {urutTerdekat && (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    📍 Terdekat
                  </span>
                )}
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="bg-white py-20 flex items-center justify-center">
                <p className="text-slate-500 text-center">
                  Tidak ada UMKM pada kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredData.map((item) => (
                  <UmkmCard
                    key={item.id}
                    id={item.id}
                    nama={item.nama}
                    subkategori={item.subkategori}
                    gambar={item.gambar}
                    distance={urutTerdekat ? item.distance : null}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <KategoriFilter
                kategori={kategori}
                setKategori={setKategori}
                total={filteredData.length}
                urutTerdekat={urutTerdekat}
                setUrutTerdekat={setUrutTerdekat}
              />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
