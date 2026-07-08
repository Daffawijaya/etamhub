"use client";

import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  activeImage: string;
  setActiveImage: (img: string) => void;
  nama: string;
};

export default function ThumbnailGallery({
  images,
  activeImage,
  setActiveImage,
  nama,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(images.length > 4);

  const checkScroll = () => {
    if (!scrollRef.current || images.length <= 4) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
    };
  }, [images]);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-2.5">
      {/* Tombol Kiri */}
      <button
        onClick={scrollLeft}
        className={`
    absolute left-0 top-1/2 z-20
  flex h-6 w-6 -translate-y-1/2 items-center justify-center
  rounded-r-md rounded-l-none
  bg-black/50 text-white shadow-lg
  backdrop-blur-sm
  transition-all duration-300 ease-out
  hover:bg-black/70
          ${
            showLeft
              ? "translate-x-0 opacity-100"
              : "-translate-x-3 opacity-0 pointer-events-none"
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Thumbnail */}
      <div
        ref={scrollRef}
        className={`flex gap-2.5 scrollbar-none ${
          images.length <= 6
            ? "justify-center overflow-hidden"
            : "overflow-x-auto scroll-smooth"
        }`}
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-1 transition-all duration-200 ${
              activeImage === img ? "border-violet-600" : "border-slate-200"
            }`}
          >
            <Image
              src={imageUrl(img)}
              alt={`${nama}-${index}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Tombol Kanan */}
      <button
        onClick={scrollRight}
        className={`
  absolute right-0 top-1/2 z-20
  flex h-6 w-6 -translate-y-1/2 items-center justify-center
  rounded-l-md rounded-r-none
  bg-black/50 text-white shadow-lg
  backdrop-blur-sm
  transition-all duration-300 ease-out
  hover:bg-black/70
  ${
    showRight
      ? "translate-x-0 opacity-100"
      : "translate-x-2 opacity-0 pointer-events-none"
  }
`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
