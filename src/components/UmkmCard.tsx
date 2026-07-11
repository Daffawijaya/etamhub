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
          bg-white
          border
          border-slate-200
          hover:border-slate-300
          hover:shadow-md
          transition-all
          duration-300
          overflow-hidden
        "
      >
        {/* IMAGE */}
        <div className="p-2">
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
                group-hover:scale-[1.02]
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-4 md:px-5 pb-4 md:pb-5 flex flex-col">
          
          <p className="text-[11px] md:text-xs text-slate-500 my-2 mb-1">
            {subkategori}
          </p>

          <h2
            className="
              text-base
              md:text-lg
              leading-tight
              font-bold
              text-slate-900
              line-clamp-2
              min-h-[48px]
              md:min-h-[56px]
            "
          >
            {nama}
          </h2>


          {/* JARAK */}
          {typeof distance === "number" && (
            <div className="mt-3">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-1
                  text-[11px]
                  font-medium
                  text-emerald-700
                "
              >
                📍 {formatDistance(distance)}
              </span>
            </div>
          )}


          {/* DETAIL BUTTON */}
          <div className="mt-5 md:mt-8 flex items-center justify-between">
            <span
              className="
                text-[11px]
                md:text-xs
                font-bold
                uppercase
                tracking-wider
                text-blue-700
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
                text-blue-700
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