"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { FaDirections } from "react-icons/fa";
import { IoInformationCircleOutline, IoClose } from "react-icons/io5";
import Link from "next/link";

type UmkmMapCardMobileProps = {
  nama: string;
  kategori: string;
  subkategori: string;
  gambar: string | string[];
  lat: number;
  lng: number;
  id: number;
  categoryColor: {
    dot: string;
    text: string;
  };
  onClose?: () => void;
};

export default function UmkmMapCardMobile({
  nama,
  kategori,
  subkategori,
  gambar,
  lat,
  lng,
  id,
  categoryColor,
  onClose,
}: UmkmMapCardMobileProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimateOut, setIsAnimateOut] = useState(false);

  // State ini mengontrol apakah gambar tampil atau tidak
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgRatio, setImgRatio] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsClosed(false);
    setIsAnimateOut(false);
    setIsVisible(false);
    setIsExpanded(false); // Pastikan gambar selalu tertutup saat buka umkm baru
    setImgRatio(null);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [id]);

  const handleClose = () => {
    setIsAnimateOut(true);
    setTimeout(() => {
      setIsClosed(true);
      if (onClose) onClose();
    }, 500);
  };

  // PENTING: useEffect untuk handleOutsideClick sudah dihapus
  // agar card tidak auto-close saat diklik di luar.

  if (!mounted || isClosed) return null;

  const fotoUtama = Array.isArray(gambar) ? gambar[0] : gambar;
  const imageSrc =
    fotoUtama && fotoUtama.length > 2
      ? imageUrl(fotoUtama)
      : "https://placehold.co/600x400/e2e8f0/64748b?text=Tidak+Ada+Foto";

  const cardContent = (
    <div
      ref={cardRef}
      className={`
        fixed bottom-0 left-0 right-0 z-30 w-full max-w-none md:hidden
        rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800
        bg-white dark:bg-[#181818] p-4 pb-6
        shadow-lg
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${
          isVisible && !isAnimateOut
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }
      `}
    >
      {/* Handle Bar: Ditekan untuk menampilkan / menyembunyikan gambar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        className="-mt-3 mb-1 flex w-full cursor-pointer justify-center py-3 group"
      >
        <div className="h-1 w-12 rounded-full bg-zinc-300 transition-all duration-200 group-hover:bg-zinc-400 group-active:scale-90 group-active:bg-zinc-500 dark:bg-zinc-700 dark:group-hover:bg-zinc-600" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-zinc-900 dark:text-white">
            {nama}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="truncate font-medium">{subkategori}</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${categoryColor.dot}`} />
              <span className={`font-medium ${categoryColor.text}`}>
                {kategori}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol X (Close) - Satu-satunya cara menutup card sekarang */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Tutup"
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            bg-zinc-100 text-zinc-600
            transition-all duration-200 ease-in-out
            hover:rotate-90 hover:bg-zinc-200
            active:scale-75
            dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700
          "
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2 rounded-full bg-[#0e7490] px-5 py-2.5
            text-sm font-medium text-white shadow-sm
            transition-all duration-200 ease-out
            hover:bg-[#155e75] hover:shadow-md
            active:scale-90 active:bg-[#164e63]
          "
        >
          <FaDirections
            size={16}
            className="transition-transform group-hover:scale-110"
          />
          <span>Rute</span>
        </a>

        <Link
          href={`/umkm/${id}`}
          className="
            flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5
            text-sm font-medium text-zinc-800
            transition-all duration-200 ease-out
            hover:bg-zinc-200
            active:scale-90 active:bg-zinc-300
            dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600
          "
        >
          <IoInformationCircleOutline size={19} />
          <span>Detail</span>
        </Link>
      </div>

      {/* 
        Container Gambar: 
        Diatur h-0 dan opacity-0 saat isExpanded false,
        dan berubah ke h-[50vh] saat isExpanded true.
      */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-zinc-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-zinc-800 ${
          isExpanded
            ? "mt-4 h-[25vh] opacity-100"
            : "mt-0 h-0 opacity-0"
        }`}
      >
        <Image
          src={imageSrc}
          alt={nama}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth && naturalHeight) {
              setImgRatio(naturalWidth / naturalHeight);
            }
          }}
        />
      </div>
    </div>
  );

  return createPortal(cardContent, document.body);
}
