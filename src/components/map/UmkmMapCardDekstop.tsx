import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { FaDirections } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import BottomAccent from "../decoration/BottomAccent";
import Link from "next/link";

type UmkmMapCardDesktopProps = {
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
};

export default function UmkmMapCardDesktop({
  nama,
  kategori,
  subkategori,
  gambar,
  lat,
  lng,
  id,
  categoryColor,
}: UmkmMapCardDesktopProps) {
  const fotoUtama = Array.isArray(gambar) ? gambar[0] : gambar;

  const imageSrc =
    fotoUtama && fotoUtama.length > 2
      ? imageUrl(fotoUtama)
      : "https://placehold.co/600x400/e2e8f0/64748b?text=Tidak+Ada+Foto";

  // Base style umum untuk kedua tombol ikon
  const baseButtonStyle = `
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    rounded-xl
    transition-all
    duration-300
    hover:scale-105
    active:scale-95
  `;

  // DITAMBAHKAN: dark:text-white & !text-white agar warna ikon tidak terimpa style link global saat darkmode
  const ruteButtonStyle = `
    ${baseButtonStyle}
    bg-[#0e7490]
    !text-white
    dark:!text-white
    shadow-sm
    hover:bg-[#155e75]
  `;

  // Warna khusus tombol Detail persis versi mobile
  const detailButtonStyle = `
    ${baseButtonStyle}
    border
    border-black/10
    dark:border-white/10
    bg-zinc-100
    dark:bg-zinc-800
    !text-zinc-800
    dark:!text-zinc-200
    hover:bg-zinc-200
    dark:hover:bg-zinc-700
  `;

  return (
    <div
      className="
        hidden
        md:block
        absolute
        top-full
        left-1/2
        z-50
        mt-8

        -translate-x-1/2

        drop-shadow-xl

        animate-in
        fade-in
        duration-200
      "
    >
      <div
        className="
          group
          relative

          w-[270px]

          overflow-hidden

          rounded-2xl

          border
          border-white
          dark:border-white/10

          bg-light
          dark:bg-[#161616]

          transition-all
          duration-300

          hover:bg-[#fbfbfd]
          dark:hover:bg-[#1a1a1a]
        "
      >
        {/* Image */}
        <div
          className="
            relative
            h-28
            w-full

            overflow-hidden

            bg-gray-100
            dark:bg-zinc-800
          "
        >
          <Image
            src={imageSrc}
            alt={nama}
            fill
            sizes="300px"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            priority
          />
        </div>

        {/* Content */}
        <div
          className="
            relative
            z-10

            flex
            items-start
            justify-between

            gap-3

            p-4
          "
        >
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className="
                line-clamp-2

                text-base
                font-medium

                leading-tight

                text-zinc-900
                dark:text-white
              "
            >
              {nama}
            </h3>

            <p
              className="
                mt-1

                truncate

                text-sm

                text-zinc-500
                dark:text-zinc-400
              "
            >
              {subkategori}
            </p>

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
              "
            >
              <div
                className={`
                  h-2
                  w-2
                  rounded-full
                  ${categoryColor.dot}
                `}
              />

              <p
                className={`
                  text-sm
                  font-medium
                  ${categoryColor.text}
                `}
              >
                {kategori}
              </p>
            </div>
          </div>

          {/* Action */}
          <div
            className="
              flex
              shrink-0
              gap-2
            "
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat Rute"
              className={ruteButtonStyle}
            >
              <FaDirections 
                size={17} 
                className="!text-white dark:!text-white" 
                color="white"
              />
            </a>

            <Link
              href={`/umkm/${id}`}
              title="Detail UMKM"
              className={detailButtonStyle}
            >
              <IoInformationCircleOutline size={22} />
            </Link>
          </div>
        </div>

        <BottomAccent />
      </div>
    </div>
  );
}