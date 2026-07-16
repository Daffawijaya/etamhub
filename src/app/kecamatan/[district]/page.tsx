"use client";

import { useMemo, useState, use, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/district/UmkmCard";
import KategoriFilter from "@/components/KategoriFilter";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/district/Pagination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(8);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(6);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [kategori, urutTerdekat]);

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
      dataDenganJarak.sort(
        (a, b) => (a.distance ?? 999999) - (b.distance ?? 999999),
      );
    } else {
      dataDenganJarak.sort((a, b) =>
        a.nama.localeCompare(b.nama, "id", {
          sensitivity: "base",
        }),
      );
    }

    return dataDenganJarak;
  }, [data, kategori, urutTerdekat, userLocation]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: districtName,
            },
          ]}
        />

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-900">
            UMKM Kecamatan {districtName}
          </h1>

          <p className="mt-2 text-slate-500">
            Menampilkan seluruh UMKM yang terdaftar di Kecamatan {districtName}.
          </p>
        </div>

        <div className="mt-6 lg:hidden space-y-3">
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

          <button
            onClick={() => setUrutTerdekat(!urutTerdekat)}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              urutTerdekat
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            📍 Lokasi Terdekat
          </button>
        </div>

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

                <div className="w-24">
                  <span
                    className={`inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 transition-opacity duration-200 ${
                      urutTerdekat ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    📍 Terdekat
                  </span>
                </div>
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="bg-white py-20 flex items-center justify-center">
                <p className="text-slate-500 text-center">
                  Tidak ada UMKM pada kategori ini.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {paginatedData.map((item) => (
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

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>

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
