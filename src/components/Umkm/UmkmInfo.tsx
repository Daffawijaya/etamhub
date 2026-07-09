"use client";

import { useState } from "react";

type Props = {
  nama: string;
  kategori: string;
  kecamatan: string;
  deskripsi: string;
};

export default function UmkmInfo({
  nama,
  kategori,
  kecamatan,
  deskripsi,
}: Props) {
  const [expanded, setExpanded] = useState(false);

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
          <span className="font-semibold text-slate-900">Kategori:</span>{" "}
          {kategori}
        </p>

        <p>
          <span className="font-semibold text-slate-900">Kecamatan:</span>{" "}
          {kecamatan}
        </p>
      </div>

      {/* Garis pemisah */}
      <div className="my-6 border-t border-slate-200" />

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Deskripsi Usaha
        </h2>

        <div className="relative">
          <p
            className={`text-sm leading-7 text-slate-600 ${
              expanded ? "" : "line-clamp-9"
            }`}
          >
            {deskripsi}
          </p>

          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-5 w-fit text-sm font-medium text-violet-600 transition hover:text-violet-700"
      >
        {expanded ? "Lihat Lebih Sedikit" : "Baca Selengkapnya"}
      </button>
    </div>
  );
}
