"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface KblibItem {
  kode: string;
  nama_id: string;
  nama_en: string | null;
}

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function KBLISelect({ value, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<KblibItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchKbli = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/kbli?search=${encodeURIComponent(keyword)}&limit=20`,
      );
      const data = await res.json();
      setResults(data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchKbli(search);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, fetchKbli]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const available = results.filter((item) => !value.includes(item.kode));

  return (
    <div className="relative space-y-3" ref={wrapperRef}>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
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

      {open && search.trim() && (
        <div
          className="
            absolute
            z-20
            mt-2
            w-full
            max-h-64
            overflow-y-auto
            rounded-xl
            border
            border-slate-200
            dark:border-slate-800
            bg-white
            dark:bg-dark
            shadow-lg
          "
        >
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-400">
              Mencari...
            </div>
          )}

          {!loading && available.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">
              Tidak ditemukan
            </div>
          )}

          {!loading &&
            available.map((item) => (
              <button
                key={item.kode}
                type="button"
                onClick={() => {
                  onChange([...value, item.kode]);
                  setSearch("");
                  setOpen(false);
                }}
                className="
                  w-full
                  px-4
                  py-3
                  text-left
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  border-b
                  border-slate-100
                  dark:border-slate-800
                  last:border-b-0
                "
              >
                <div className="font-semibold">{item.kode}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {item.nama_id}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
