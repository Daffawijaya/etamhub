"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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

  const whatsappNumber = whatsapp?.replace(/\D/g, "").replace(/^0/, "62");

  const displayWhatsapp = whatsappNumber
    ? whatsappNumber.replace(/^62/, "0")
    : "";

  return (
    <div className="w-full bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[320px_1fr_280px]">
        {/* FOTO */}
        <div>
          {/* GAMBAR UTAMA */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200">
            <Image src={activeImage} alt={nama} fill className="object-cover" />
          </div>

          {/* THUMBNAIL */}
          {gambar.length > 1 && (
            <ThumbnailGallery
              images={gambar}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              nama={nama}
            />
          )}
        </div>

        {/* INFORMASI */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            {kategori}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900">
            {nama}
          </h1>

          <p className="mt-2 text-sm text-slate-500">{kecamatan}</p>

          <div className="my-5 h-px bg-slate-200" />

          <div>
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Deskripsi Usaha
            </h2>

            <p className="text-sm leading-7 text-slate-600">{deskripsi}</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-4">
          {/* ALAMAT */}
          <div
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                "_blank",
              )
            }
            className="cursor-pointer rounded-xl bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)] p-4 text-white transition hover:scale-[1.02]"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-purple-50">
              Lokasi Usaha
            </p>

            <h3 className="mt-2 text-base font-bold">Alamat</h3>

            <p className="mt-3 text-sm leading-6 text-purple-50">{alamat}</p>
          </div>

          {/* PEMILIK */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Informasi Pemilik
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Nama Pemilik</p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {pemilik}
                </p>
              </div>

              {displayWhatsapp && (
                <div>
                  <p className="text-xs text-slate-500">WhatsApp</p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {displayWhatsapp}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {whatsappNumber && (
                <button
                  onClick={() =>
                    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
                  }
                  className="w-full cursor-pointer rounded-lg border border-[#25D366] bg-white px-4 py-2.5 text-sm font-medium text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
                >
                  Chat WhatsApp
                </button>
              )}

              {instagram?.trim() && (
                <button
                  onClick={() =>
                    window.open(
                      `https://instagram.com/${instagram.replace("@", "")}`,
                      "_blank",
                    )
                  }
                  className="w-full cursor-pointer rounded-lg border border-[#DD2A7B] bg-white px-4 py-2.5 text-sm font-medium text-[#DD2A7B] transition-all hover:bg-[#DD2A7B] hover:text-white"
                >
                  Kunjungi Instagram
                </button>
              )}

              {facebook?.trim() && (
                <button
                  onClick={() =>
                    window.open(`https://facebook.com/${facebook}`, "_blank")
                  }
                  className="w-full cursor-pointer rounded-lg border border-[#1877F2] bg-white px-4 py-2.5 text-sm font-medium text-[#1877F2] transition-all hover:bg-[#1877F2] hover:text-white"
                >
                  Kunjungi Facebook
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbnailGallery({
  images,
  activeImage,
  setActiveImage,
  nama,
}: {
  images: string[];
  activeImage: string;
  setActiveImage: (img: string) => void;
  nama: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(images.length > 4);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative mt-2">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-none"
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative h-15 w-15 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              activeImage === img ? "border-violet-600" : "border-slate-200"
            }`}
          >
            <Image
              src={img}
              alt={`${nama}-${index}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-md transition hover:bg-slate-50"
        >
          ‹
        </button>
      )}

      {showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-md transition hover:bg-slate-50"
        >
          ›
        </button>
      )}
    </div>
  );
}
