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
      className={`flex flex-col ${
        expanded
          ? `
            max-h-[65vh]
            overflow-y-auto
            pr-2
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          `
          : ""
      }`}
    >
      <h1 className="text-3xl font-bold text-slate-900">{nama}</h1>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900"></span> {kecamatan}
        </p>
      </div>

      <div className="my-6 border-t border-slate-200" />

      <div>
        <div className="mb-4 space-y-2 text-sm text-slate-600">
          <p>
            <span>Kategori:</span>{" "}
            <span className="font-semibold text-slate-900">
              {kategori}
            </span>{" "}
          </p>
          <p>
            <span>Subkategori:</span>{" "}
            <span className="font-semibold text-slate-900">
              {subkategori}
            </span>{" "}
          </p>
        </div>

        <div className="relative">
          <p
            ref={textRef}
            className={`text-sm leading-7 text-slate-600 ${
              expanded ? "" : "line-clamp-9"
            }`}
          >
            {deskripsi}
          </p>

          {!expanded && showButton && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      </div>

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 w-fit text-sm font-medium text-violet-600 transition hover:text-violet-700"
        >
          {expanded ? "Lihat Lebih Sedikit" : "Baca Selengkapnya"}
        </button>
      )}
    </div>
  );
}
