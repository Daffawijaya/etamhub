"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  nama: string;
  kategori: string;
  subkategori: string;
  kecamatan: string;
  deskripsi: string;
};

export default function UmkmInfo({
  nama,
  kategori,
  subkategori,
  kecamatan,
  deskripsi,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const el = textRef.current;

      if (!el) return;

      const isOverflowing = el.scrollHeight > el.clientHeight;
      setShowButton(isOverflowing);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [deskripsi]);

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white
        bg-light
        dark:border-white/10
        dark:bg-[#161616]
        p-6
        md:p-8
        ${
          expanded
            ? `
              max-h-[70vh]
              overflow-y-auto
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            `
            : ""
        }
      `}
    >
      {/* Glow */}
      <div
        className="
          absolute
          inset-0
          bg-light
          dark:bg-[#161616]
          pointer-events-none
        "
      />

      <div className="relative z-10">
        {/* Header */}

        <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-white md:text-4xl">
          {nama}
        </h1>

        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className="
              rounded-full
              border
              border-violet-500/20
              bg-violet-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-violet-600
              dark:text-violet-300
            "
          >
            {kategori}
          </span>

          <span
            className="
              rounded-full
              border
              border-white
              bg-light-bg
              px-3
              py-1
              text-xs
              font-medium
              text-zinc-600
              dark:border-white/10
              dark:bg-white/[0.03]
              dark:text-zinc-300
            "
          >
            {subkategori}
          </span>
        </div>

        {/* Kecamatan */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-white
            bg-light-bg
            px-4
            py-3
            dark:border-white/10
            dark:bg-white/[0.03]
          "
        >
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Kecamatan
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
            {kecamatan}
          </p>
        </div>

        {/* Divider */}
        <div className="my-4" />

        {/* Description */}
        <div>
          <div className="relative">
            <p
              ref={textRef}
              className={`
                text-sm
                leading-8
                text-zinc-500
                dark:text-zinc-400
                ${expanded ? "" : "line-clamp-5"}
              `}
            >
              {deskripsi}
            </p>

            {!expanded && showButton && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-10
                  bg-gradient-to-t
                  from-light
                  via-light/80
                  to-transparent
                  dark:from-[#161616]
                  dark:via-[#161616]/80
                  dark:to-transparent
                "
              />
            )}
          </div>
        </div>

        {/* Read More */}
        {showButton && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              mt-6
              rounded-xl
              border
              border-violet-500/20
              bg-violet-500/10
              px-4
              py-2
              text-sm
              font-medium
              text-violet-600
              transition-all
              duration-300
              hover:bg-violet-500/15
              hover:text-zinc-900
              dark:text-violet-300
              dark:hover:text-white
            "
          >
            {expanded ? "Lihat Lebih Sedikit" : "Baca Selengkapnya"}
          </button>
        )}
      </div>
    </div>
  );
}