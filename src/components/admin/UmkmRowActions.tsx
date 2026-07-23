"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface Props {
  id: string | number;
}

export default function UmkmRowActions({ id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleMenu() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 176,
      });
    }

    setOpen((prev) => !prev);
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Yakin ingin menghapus UMKM ini?");

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/umkm/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus UMKM");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus UMKM");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full
          transition-all duration-300
          hover:bg-slate-100

          dark:hover:bg-white/10
        "
      >
        <MoreHorizontal
          size={18}
          className="
            text-slate-600
            dark:text-slate-300
            transition-colors duration-300
          "
        />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
            }}
            className="
              z-[9999]
              w-44
              overflow-hidden
              rounded-xl
              border
              shadow-xl

              border-slate-200
              bg-white

              dark:border-white/10
              dark:bg-dark-card

              transition-all duration-300
            "
          >
            <button
              onClick={() => {
                router.push(`/admin/umkm/${id}/edit`);
                setOpen(false);
              }}
              className="
                flex w-full items-center gap-3
                px-4 py-3
                text-sm font-medium

                text-slate-700
                transition-colors duration-300
                hover:bg-slate-50

                dark:text-slate-200
                dark:hover:bg-white/10
              "
            >
              <Pencil size={16} />
              Edit UMKM
            </button>

            <div
              className="
                h-px
                bg-slate-100
                dark:bg-white/10
              "
            />

            <button
              disabled={loading}
              onClick={handleDelete}
              className="
                flex w-full items-center gap-3
                px-4 py-3
                text-sm font-medium

                text-red-600
                transition-colors duration-300
                hover:bg-red-50

                dark:text-red-400
                dark:hover:bg-red-950/40

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Trash2 size={16} />

              {loading ? "Menghapus..." : "Hapus UMKM"}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
