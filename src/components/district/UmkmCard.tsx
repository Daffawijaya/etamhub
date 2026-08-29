import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import BottomAccent from "../decoration/BottomAccent";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";

type BadgeData = {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
  label: string;
  color: string;
  bgColor: string;
} | null;

type Props = {
  id: string;
  nama: string;
  subkategori: string;
  deskripsi: string;
  gambar: string[];
  distance?: number | null;
  badge?: BadgeData;
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-3 w-3" />,
  silver: <SilverMedalIcon className="h-3 w-3" />,
  gold: <GoldMedalIcon className="h-3 w-3" />,
  platinum: <DiamondIcon className="h-3 w-3" />,
};

const BADGE_RING: Record<string, string> = {
  bronze: "border-amber-300/80 dark:border-amber-500/60",
  silver: "border-emerald-300/80 dark:border-emerald-500/60",
  gold: "border-orange-300/80 dark:border-orange-500/60",
  platinum: "border-purple-300/80 dark:border-purple-500/60",
};

export default function UmkmCard({
  id,
  nama,
  subkategori,
  deskripsi,
  gambar,
  distance,
  badge,
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
        rounded-xl
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
          rounded-t-xl
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

        {/* Badge on image */}
        {badge && badge.level !== "none" && (
          <span
            className={`absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6 inline-flex items-center gap-1 rounded-full border bg-white/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm dark:bg-black/70 ${
              BADGE_RING[badge.level] ?? ""
            } ${badge.color}`}
          >
            {BADGE_ICONS[badge.level]}
            {badge.label}
          </span>
        )}
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
