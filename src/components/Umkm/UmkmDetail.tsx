"use client";

import { useState } from "react";
import UmkmGallery from "./UmkmGallery";
import UmkmInfo from "./UmkmInfo";
import UmkmSidebar from "./UmkmSidebar";

type Props = {
  id: number;
  nama: string;
  pemilik: string;
  kategori: string;
  subkategori: string;
  kecamatan: string;
  alamat: string;
  deskripsi: string;
  gambar: string[];
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  tiktok?: string;
  lat: number;
  lng: number;
};

export default function UmkmDetail({
  nama,
  pemilik,
  kategori,
  subkategori,
  kecamatan,
  alamat,
  deskripsi,
  gambar,
  instagram,
  facebook,
  whatsapp,
  tiktok,
  lat,
  lng,
}: Props) {
  const [activeImage, setActiveImage] = useState(gambar[0]);

  return (
    <section className="relative overflow-hidden bg-light-bg dark:bg-dark">
      {/* Background Glow */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-6">
        <div
          className="
            grid
            gap-4
            lg:grid-cols-[420px_minmax(0,1fr)_320px]
            xl:gap-6
          "
        >
          {/* Gallery */}
          <div className="w-full min-w-0">
            <UmkmGallery
              nama={nama}
              gambar={gambar}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />
          </div>

          {/* Content */}
          <div className="w-full min-w-0">
            <UmkmInfo
              nama={nama}
              kategori={kategori}
              subkategori={subkategori}
              kecamatan={kecamatan}
              deskripsi={deskripsi}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full min-w-0">
            <UmkmSidebar
              pemilik={pemilik}
              alamat={alamat}
              whatsapp={whatsapp}
              instagram={instagram}
              facebook={facebook}
              tiktok={tiktok}
              lat={lat}
              lng={lng}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
