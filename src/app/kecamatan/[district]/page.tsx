"use client";

import { useMemo, useState, use, useEffect } from "react";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/district/UmkmCard";
import KategoriFilter from "@/components/district/KategoriFilter";
import umkms from "@/data/umkm.json";
import { slugify } from "@/lib/slugify";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/district/Pagination";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import DistrictHero from "@/components/district/DistrictHero";

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

  const totalSubkategori = new Set(data.map((item) => item.subkategori)).size;

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

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark text-zinc-900 dark:text-white transition-colors">
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
          totalUmkm={data.length}
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {filteredData.length}
            </span>{" "}
            UMKM
          </p>
        </div>

        {filteredData.length === 0 ? (
          <div
            className="
              relative
              mt-8
              overflow-hidden
              rounded-3xl
              border
              border-white
              bg-light
              dark:border-white/10
              dark:bg-[#161616]
              py-20
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_45%)]
              "
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div
                className="
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white
                  bg-white/30
                  dark:border-white/10
                  dark:bg-white/[0.03]
                  text-2xl
                "
              >
                🔍
              </div>

              <p className="text-center text-zinc-700 dark:text-zinc-300">
                Tidak ada UMKM pada kategori ini
              </p>

              <p className="mt-2 text-center text-sm text-zinc-500">
                Coba pilih kategori lain untuk melihat data UMKM.
              </p>
            </div>

            <div
              className="
                absolute
                bottom-0
                left-0
                h-px
                w-full
                bg-gradient-to-r
                from-violet-500
                via-fuchsia-400
                to-transparent
              "
            />
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedData.map((item) => (
                <UmkmCard
                  key={item.id}
                  id={String(item.id)}
                  nama={item.nama}
                  subkategori={item.subkategori}
                  deskripsi={item.deskripsi}
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
      </main>

      <Footer />
    </div>
  );
}
