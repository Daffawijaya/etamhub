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
  kecamatan: string;
  alamat: string;
  deskripsi: string;
  gambar: string[];
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  lat: number;
  lng: number;
};

export default function UmkmDetail({
  nama,
  pemilik,
  kategori,
  kecamatan,
  alamat,
  deskripsi,
  gambar,
  instagram,
  facebook,
  whatsapp,
  lat,
  lng,
}: Props) {
  const [activeImage, setActiveImage] = useState(gambar[0]);

  return (
    <div className="w-full bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[320px_1fr_280px]">
        <UmkmGallery
          nama={nama}
          gambar={gambar}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
        />

        <UmkmInfo
          nama={nama}
          kategori={kategori}
          kecamatan={kecamatan}
          deskripsi={deskripsi}
        />

        <UmkmSidebar
          pemilik={pemilik}
          alamat={alamat}
          whatsapp={whatsapp}
          instagram={instagram}
          facebook={facebook}
          lat={lat}
          lng={lng}
        />
      </div>
    </div>
  );
}
