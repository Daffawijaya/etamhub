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

  const needScroll = images.length > 5;

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;

    if (!el || !needScroll) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();

    const el = scrollRef.current;

    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [images, needScroll]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-3 w-full min-w-0">
      {/* Tombol Kiri */}
      {needScroll && (
        <button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-r-md bg-black/60 text-white shadow backdrop-blur-sm transition-all duration-200 hover:bg-black/80 ${
            showLeft ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
      )}

      {/* Thumbnail */}
      <div
        ref={scrollRef}
        className={
          needScroll
            ? "flex w-full min-w-0 gap-2 overflow-x-auto scroll-smooth scrollbar-none"
            : "flex w-full justify-center gap-2"
        }
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-all duration-200 ${
              activeImage === img
                ? "border-primary ring-2 ring-primary/20"
                : "border-slate-200"
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
      {needScroll && (
        <button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-l-md bg-black/60 text-white shadow backdrop-blur-sm transition-all duration-200 hover:bg-black/80 ${
            showRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
