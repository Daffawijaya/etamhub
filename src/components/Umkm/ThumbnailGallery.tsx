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

  const scrollLeftHandler = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRightHandler = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-4 w-full min-w-0">
      {/* Left Button */}
      {needScroll && (
        <button
          onClick={scrollLeftHandler}
          className={`
            absolute
            left-0
            top-1/2
            z-20
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-r-xl
            border
            border-white/10
            bg-[#161616]/95
            text-zinc-300
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-violet-500/20
            hover:bg-violet-500/10
            hover:text-white
            ${showLeft ? "opacity-100" : "pointer-events-none opacity-0"}
          `}
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

      {/* Thumbnails */}
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
            className={`
              relative
              h-16
              w-16
              shrink-0
              overflow-hidden
              rounded-xl
              border
              transition-all
              duration-300
              ${
                activeImage === img
                  ? `
                    border-violet-500/20
                    bg-violet-500/10
                    ring-2
                    ring-violet-500/20
                  `
                  : `
                    border-white/10
                    hover:border-violet-500/20
                  `
              }
            `}
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

      {/* Right Button */}
      {needScroll && (
        <button
          onClick={scrollRightHandler}
          className={`
            absolute
            right-0
            top-1/2
            z-20
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-l-xl
            border
            border-white/10
            bg-[#161616]/95
            text-zinc-300
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-violet-500/20
            hover:bg-violet-500/10
            hover:text-white
            ${showRight ? "opacity-100" : "pointer-events-none opacity-0"}
          `}
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
