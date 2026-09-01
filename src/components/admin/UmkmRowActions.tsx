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
import { useModal } from "@/components/ui/modal";

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
  const modal = useModal();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setRole(data.role))
      .catch(() => {});
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

  const isSuperAdmin = role === "super_admin";

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
    modal.loading({ title: "Mengubah status..." });
    try {
      const res = await fetch(`/api/admin/umkm/${id}/publish`, {
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
      modal.success({ title: "Berhasil!", description: "Status UMKM berhasil diubah." });
      onStatusChanged?.();
    } catch (error) {
      console.error(error);
      modal.error({ title: "Gagal", description: "Gagal mengubah status" });
    }
  }
  async function handleDelete() {
    const confirmed = await modal.confirm({
      title: "Hapus UMKM?",
      description: "Data UMKM dan semua produknya akan dihapus permanen.",
      confirmText: "Hapus",
      cancelText: "Batal",
      confirmButtonVariant: "danger",
    });

    if (!confirmed) return;    modal.loading({ title: "Menghapus..." });
    try {
      const res = await fetch(`/api/admin/umkm/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus UMKM");
      }

      setOpen(false);
      modal.success({ title: "Berhasil!", description: "UMKM berhasil dihapus." });
      onStatusChanged?.();
    } catch (error) {
      console.error(error);
      modal.error({ title: "Gagal", description: "Gagal menghapus UMKM" });
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
            {isSuperAdmin && (
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
            )}
            {showPublishAction && (
              <>
                <button
                  
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
                  {published ? "Jadikan Privat" : "Jadikan Publik"}
                </button>

                <div
                  className="
        bg-slate-100
        dark:bg-white/10
      "
                />
              </>
            )}

            {isSuperAdmin && (
              <button
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
              "
              >
                <Trash2 size={16} />

                Hapus UMKM
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
