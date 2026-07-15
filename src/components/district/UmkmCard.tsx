import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

type Props = {
  id: number;
  nama: string;
  subkategori: string;
  gambar: string[];
  distance?: number | null;
};

export default function UmkmCard({
  id,
  nama,
  subkategori,
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
    <Link href={`/umkm/${id}`} className="block h-full">
      <article
        className="
          group
          h-full
          flex
          flex-col
          bg-white
          border
          border-slate-200
          rounded-2xl
          overflow-hidden
          hover:border-slate-300
          hover:shadow-lg
          transition-all
          duration-300
        "
      >
        {/* IMAGE */}
        <div className="">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={imageUrl(gambar[0])}
              alt={nama}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.03]
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-4 md:px-5 pb-4">
          {/* SUBKATEGORI */}
          <p className="text-[11px] md:text-xs text-slate-500 mt-4">
            {subkategori}
          </p>

          {/* JUDUL FIX 2 BARIS */}
          <h2
            className="
              text-base
              md:text-lg
              font-bold
              text-slate-900
              leading-6
              line-clamp-2
              h-12
            "
          >
            {nama}
          </h2>

          {/* SLOT JARAK - SELALU ADA AGAR CARD SAMA TINGGI */}
          <div className="h-7 flex items-center">
            {typeof distance === "number" && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-50
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-emerald-700
                "
              >
                📍 {formatDistance(distance)}
              </span>
            )}
          </div>

          {/* BUTTON SELALU DI BAWAH */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span
              className="
                text-[11px]
                md:text-xs
                font-bold
                uppercase
                tracking-wider
                text-primary
              "
            >
              Lihat Detail
            </span>

            <svg
              className="
                w-4
                h-4
                md:w-5
                md:h-5
                text-primary
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}