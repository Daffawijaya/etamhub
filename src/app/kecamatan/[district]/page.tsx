"use client";

import { useMemo, useState, use, useEffect } from "react";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/district/UmkmCard";
import KategoriFilter from "@/components/district/KategoriFilter";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/district/Pagination";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import DistrictHero from "@/components/district/DistrictHero";

type Props = {
  params: Promise<{
    district: string;
  }>;
};

interface Badge {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
  label: string;
  color: string;
  bgColor: string;
}

interface Umkm {
  id: string;
  nama: string;
  subkategori: string;
  deskripsi: string;
  gambar: string[];
  kategori: string;
  kecamatan: string;
  lat: number;
  lng: number;
  badge?: Badge | null;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function KecamatanPage({ params }: Props) {
  const { district } = use(params);

  const [umkms, setUmkms] = useState<Umkm[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 8;

  const [kategori, setKategori] = useState("Semua");
  const [urutTerdekat, setUrutTerdekat] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Ambil dari Supabase lewat API
  useEffect(() => {
    async function fetchUmkm() {
      try {
        const districtName = district
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const params = new URLSearchParams({
          kecamatan: districtName,
          status: "public",
          page: String(currentPage),
          limit: String(limit),
        });

        const res = await fetch(`/api/public/umkm?${params}`, {
          cache: "no-store",
        });

        const result = await res.json();

        setUmkms(result.data ?? []);
        setTotal(result.total ?? 0);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUmkm();
  }, [district, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [kategori, urutTerdekat]);

  useEffect(() => {
    if (!urutTerdekat) {
      setUserLocation(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Gagal mendapatkan lokasi pengguna.");
      },
    );
  }, [urutTerdekat]);

  const totalSubkategori = new Set(umkms.map((item) => item.subkategori)).size;

  const filteredData = useMemo(() => {
    let hasil = [...umkms];

    if (kategori !== "Semua") {
      hasil = hasil.filter((item) => item.kategori === kategori);
    }

    const dataDenganJarak = hasil.map((item) => {
      let distance = null;

      if (
        userLocation &&
        typeof item.lat === "number" &&
        typeof item.lng === "number"
      ) {
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
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
      );
    } else {
      dataDenganJarak.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    }

    return dataDenganJarak;
  }, [umkms, kategori, urutTerdekat, userLocation]);

  const totalPages = Math.ceil(total / limit);

  const districtName = umkms[0]?.kecamatan ?? "Tidak Diketahui";

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark text-zinc-900 dark:text-white">
      <DetailNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-6 pt-20 pb-10">
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

        <DistrictHero
          districtName={districtName}
          totalUmkm={total}
          totalSubkategori={totalSubkategori}
          urutTerdekat={urutTerdekat}
        />

        <div className="sticky top-16 z-20 mt-6">
          <KategoriFilter
            kategori={kategori}
            setKategori={setKategori}
            total={filteredData.length}
            urutTerdekat={urutTerdekat}
            setUrutTerdekat={setUrutTerdekat}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <UmkmCard
              key={item.id}
              id={item.id}
              nama={item.nama}
              subkategori={item.subkategori}
              deskripsi={item.deskripsi}
              gambar={item.gambar}
              distance={urutTerdekat ? item.distance : null}
              badge={item.badge}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  );
}
