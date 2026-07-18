import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { FaDirections } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import BottomAccent from "../decoration/BottomAccent";
import Link from "next/link";

type UmkmMapCardProps = {
  nama: string;
  kategori: string;
  subkategori: string;
  gambar: string | string[];
  lat: number;
  lng: number;
  id: number;
};

export default function UmkmMapCard({
  nama,
  kategori,
  subkategori,
  gambar,
  lat,
  lng,
  id,
}: UmkmMapCardProps) {
  const fotoUtama = Array.isArray(gambar) ? gambar[0] : gambar;

  const imageSrc =
    fotoUtama && fotoUtama.length > 2
      ? imageUrl(fotoUtama)
      : "https://placehold.co/600x400/e2e8f0/64748b?text=Tidak+Ada+Foto";

  const getCategoryColor = (kat: string) => {
    const key = kat.toLowerCase();

    if (key.includes("perdagangan"))
      return {
        dot: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
      };

    if (key.includes("jasa"))
      return {
        dot: "bg-[#8B5CF6]",
        text: "text-[#8B5CF6]",
      };

    if (key.includes("industri"))
      return {
        dot: "bg-[#F59E0B]",
        text: "text-[#F59E0B]",
      };

    return {
      dot: "bg-[#10B981]",
      text: "text-[#10B981]",
    };
  };

  const categoryColor = getCategoryColor(kategori);

  const buttonStyle = `
    flex
    h-10
    w-10
    items-center
    justify-center

    rounded-xl

    border
    border-black/10
    dark:border-white/10

    bg-black/[0.03]
    dark:bg-white/[0.03]
    [&>svg]:text-[#844ec0]

    text-zinc-500
    dark:text-zinc-300

    transition-all
    duration-300

    hover:text-[#844ec0]
    dark:hover:text-[#b98bea]

    hover:bg-[#844ec0]/10
    dark:hover:bg-[#844ec0]/20

    hover:scale-105
  `;

  return (
    <div
      className="
        absolute
        top-full
        left-1/2
        z-50
        mt-5

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
              className={buttonStyle}
            >
              <FaDirections size={17} />
            </a>

            <Link
              href={`/umkm/${id}`}
              title="Detail UMKM"
              className={buttonStyle}
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
