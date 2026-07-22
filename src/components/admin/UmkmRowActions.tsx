"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface Props {
  id: number | string;
  onEdit?: () => void;
}

export default function UmkmRowActions({ id, onEdit }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleDelete() {
    console.log("ID DELETE:", id);
    const confirmDelete = window.confirm("Yakin ingin menghapus UMKM ini?");

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/umkm/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();

        throw new Error(error.message || "Gagal menghapus UMKM");
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus UMKM");
    } finally {
      setLoading(false);
    }
    if (!confirmDelete) return;
  }

  return (
    <div ref={wrapperRef} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100"
      >
        <MoreHorizontal size={18} className="text-slate-600" />
      </button>

      <div
        className={`absolute right-0 top-11 z-50 w-44 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <button
          onClick={() => {
            onEdit?.();
            setOpen(false);
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Pencil size={16} />
          Edit UMKM
        </button>

        <div className="h-px bg-slate-100" />

        <button
          disabled={loading}
          onClick={handleDelete}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />

          {loading ? "Menghapus..." : "Hapus UMKM"}
        </button>
      </div>
    </div>
  );
}
