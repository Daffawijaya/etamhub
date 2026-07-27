"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface Props {
  id: string | number;
  published: boolean | null;
  onEdit?: () => void;
  onStatusChanged?: () => void;
  showPublishAction?: boolean;
}

export default function UmkmRowActions({
  id,
  published,
  onEdit,
  onStatusChanged,
  showPublishAction = true,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
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
  async function handleTogglePublished() {
    try {
      setPublishLoading(true);

      const res = await fetch(`/api/umkm/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !published,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengubah status");
      }

      setOpen(false);
      onStatusChanged?.();
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status");
    } finally {
      setPublishLoading(false);
    }
  }
  async function handleDelete() {
    const confirmDelete = window.confirm("Yakin ingin menghapus UMKM ini?");

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`/api/umkm/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus UMKM");
      }

      setOpen(false);
      onStatusChanged?.();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus UMKM");
    } finally {
      setDeleteLoading(false);
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
                router.push(`/admin/umkm/${id}`);
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
              <ExternalLink size={16} />
              Detail UMKM
            </button>
            <button
              onClick={() => {
                if (onEdit) {
                  onEdit();
                } else {
                  router.push(`/admin/umkm/${id}/edit`);
                }

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
            {showPublishAction && (
              <>
                <button
                  disabled={publishLoading}
                  onClick={handleTogglePublished}
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
                  {published ? <EyeOff size={16} /> : <Eye size={16} />}
                  {publishLoading
                    ? "Mengubah..."
                    : published
                      ? "Jadikan Privat"
                      : "Jadikan Publik"}
                </button>

                <div
                  className="
        bg-slate-100
        dark:bg-white/10
      "
                />
              </>
            )}

            <button
              disabled={deleteLoading}
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

              {deleteLoading ? "Menghapus..." : "Hapus UMKM"}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
