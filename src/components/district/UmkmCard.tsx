import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import BottomAccent from "../decoration/BottomAccent";

type Props = {
  id: string;
  nama: string;
  subkategori: string;
  deskripsi: string;
  gambar: string[];
  distance?: number | null;
};

export default function UmkmCard({
  id,
  nama,
  subkategori,
  deskripsi,
  gambar,
  distance,
}: Props) {
  const formatDistance = (value: number) => {
    if (value < 1) {
      return `${Math.round(value * 1000)} m`;
    }

    return `${value.toFixed(1)} km`;
  };

  return (
    <Link
      href={`/umkm/${id}`}
      className="
        group
        flex
        flex-col
        h-full
        overflow-hidden
        rounded-3xl
        bg-light
        border
        border-white
        hover:border-white
        transition-all
        duration-300
        dark:bg-[#1b1b1b]
        dark:border-zinc-800
        dark:hover:border-zinc-700
        relative
      "
    >
      {/* Image */}
      <div
        className="
          relative
          aspect-[4/3]
          overflow-hidden
          rounded-t-3xl
          bg-light-bg
          dark:bg-zinc-900
        "
      >
        <Image
          src={imageUrl(gambar?.[0])}
          alt={nama}
          fill
          sizes="
            (max-width:768px) 100vw,
            (max-width:1200px) 50vw,
            33vw
          "
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div
        className="
          flex
          flex-col
          flex-1
          p-3
          sm:p-5
          md:p-6
        "
      >
        {/* Subkategori */}
        <div
          className="
            text-[9px]
            sm:text-xs
            capitalize
            tracking-wider
            text-zinc-500
          "
        >
          {subkategori}
        </div>

        {/* Nama */}
        <h3
          className="
            mt-2
            sm:mt-3
            text-sm
            sm:text-lg
            md:text-xl
            font-semibold
            leading-tight
            text-zinc-900
            dark:text-white
            line-clamp-3
          "
        >
          {nama}
        </h3>

        {/* Deskripsi */}
        <p
          className="
            mt-3
            sm:mt-4
            text-[11px]
            sm:text-sm
            leading-relaxed
            text-zinc-500
            line-clamp-2
          "
        >
          {deskripsi}
        </p>

        {/* Bottom Section */}
        <div className="mt-auto pt-2">
          {/* Fixed Distance Slot */}
          <div
            className="
              h-5
              sm:h-6
              flex
              items-center
              text-[11px]
              sm:text-sm
              text-zinc-500
              dark:text-zinc-400
            "
          >
            {typeof distance === "number" && (
              <span className="inline-flex items-center gap-1.5">
                📍 {formatDistance(distance)}
              </span>
            )}
          </div>

          {/* Button */}
          <div className="pt-2">
            <span
              className="
                inline-flex
                items-center
                gap-1
                sm:gap-2
                text-[11px]
                sm:text-sm
                text-zinc-900
                dark:text-white
                transition-all
                duration-300
                group-hover:translate-x-1
              "
            >
              Lihat Detail
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
      <BottomAccent />
    </Link>
  );
}
