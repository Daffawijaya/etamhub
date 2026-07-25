"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { kbliData } from "@/data/kbli";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function KBLISelect({ value, onChange }: Props) {
  const [search, setSearch] = useState("");

  const filtered = kbliData
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        !value.includes(item.kode) &&
        (item.kode.includes(keyword) ||
          item.nama.toLowerCase().includes(keyword))
      );
    })
    .slice(0, 10);

  return (
    <div className="relative space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari kode atau nama KBLI..."
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-dark
          px-4
          py-3
          text-sm
          text-slate-700
          dark:text-white
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
          outline-none
          focus:border-pur
        "
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((kode) => (
            <button
              key={kode}
              type="button"
              onClick={() => onChange(value.filter((item) => item !== kode))}
              className="
                flex
                items-center
                gap-1.5
                rounded-md
                bg-slate-500/10
                text-black
                dark:text-white
                pl-2 pr-1
                py-1
                text-sm
              "
            >
              {kode}
              <X size={14} />
            </button>
          ))}
        </div>
      )}

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
                onChange([...value, item.kode]);
                setSearch("");
              }}
              className="
                w-full
                px-4
                py-3
                text-left
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              <div className="font-semibold">{item.kode}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {item.nama}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
