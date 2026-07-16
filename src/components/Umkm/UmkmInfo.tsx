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
        border-white/10
        bg-[#161616]
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
          bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_45%)]
          pointer-events-none
        "
      />

      <div className="relative z-10">
        {/* Header */}

        <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
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
              text-violet-300
            "
          >
            {kategori}
          </span>

          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-1
              text-xs
              font-medium
              text-zinc-300
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
            border-white/10
            bg-white/[0.03]
            px-4
            py-3
          "
        >
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Kecamatan
          </p>

          <p className="mt-1 text-sm font-medium text-white">{kecamatan}</p>
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
                text-zinc-400
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
                  from-[#161616]
                  via-[#161616]/80
                  to-transparent
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
              text-violet-300
              transition-all
              duration-300
              hover:bg-violet-500/15
              hover:text-white
            "
          >
            {expanded ? "Lihat Lebih Sedikit" : "Baca Selengkapnya"}
          </button>
        )}
      </div>
    </div>
  );
}
