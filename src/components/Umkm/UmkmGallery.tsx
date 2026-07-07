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
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-200">
        <Image
          src={imageUrl(activeImage)}
          alt={nama}
          fill
          className="object-cover"
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