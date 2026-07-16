"use client";

import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import ThumbnailGallery from "./ThumbnailGallery";

type Props = {
  nama: string;
  gambar: string[];
  activeImage: string;
  setActiveImage: (img: string) => void;
};

export default function UmkmGallery({
  nama,
  gambar,
  activeImage,
  setActiveImage,
}: Props) {
  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#161616]
        "
      >
        {/* Glow */}
        <div
          className="
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
            bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_45%)]
            pointer-events-none
            z-10
          "
        />

        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl(activeImage)}
            alt={nama}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
          />
        </div>

        {/* Bottom Accent */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-0
            bg-gradient-to-r
            from-violet-500
            via-fuchsia-400
            to-transparent
            transition-all
            duration-500
            group-hover:w-full
          "
        />
      </div>

      {gambar.length > 1 && (
        <ThumbnailGallery
          images={gambar}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          nama={nama}
        />
      )}
    </div>
  );
}
