"use client";

import { useState } from "react";
import { kbliData } from "@/data/kbli";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function KBLISelect({ value, onChange }: Props) {
  const [search, setSearch] = useState("");

  const filtered = kbliData
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.kode.includes(keyword) || item.nama.toLowerCase().includes(keyword)
      );
    })
    .slice(0, 10);

  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari KBLI..."
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-dark
placeholder:text-slate-400
      dark:placeholder:text-slate-500
          px-4
          py-3

          text-sm
          text-slate-700
          dark:text-white

          outline-none

          focus:border-pur
        "
      />

      {search && filtered.length > 0 && (
        <div
          className="
            absolute
            z-20
            mt-2
            w-full
            rounded-xl
            border
            border-slate-200
            dark:border-slate-800
            bg-white
            dark:bg-dark
            shadow-lg
            overflow-hidden
          "
        >
          {filtered.map((item) => (
            <button
              key={item.kode}
              type="button"
              onClick={() => {
                onChange(item.kode);
                setSearch(`${item.kode} - ${item.nama}`);
              }}
              className="
                w-full
                px-4
                py-3
                text-left
                text-sm
                hover:bg-slate-100
                dark:hover:bg-slate-800
                text-slate-700
                dark:text-white
              "
            >
              <b>{item.kode}</b>
              <br />
              <span>{item.nama}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
