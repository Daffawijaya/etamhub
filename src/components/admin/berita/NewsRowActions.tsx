"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useModal } from "@/components/ui/modal";

interface Props {
  id: string;
  published: boolean | null;
  role?: string;
  onDeleted?: (id: string) => void;
  onStatusChanged?: (id: string, published: boolean) => void;
}

export default function NewsRowActions({
  id,
  published,
  role,
  onDeleted,
  onStatusChanged,
}: Props) {
  const router = useRouter();
  const modal = useModal();

  const [open, setOpen] = useState(false);
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 176,
      });
    }

    setOpen((current) => !current);
  };

  const handleTogglePublished = async () => {
    modal.loading({ title: "Mengubah status..." });
    try {
      const response = await fetch(`/api/admin/berita/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !published,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah status berita");
      }

      const nextPublished = !published;

      setOpen(false);
      modal.success({ title: "Berhasil!", description: "Status berita berhasil diubah." });
      onStatusChanged?.(id, nextPublished);
    } catch (error) {
      console.error(error);
      modal.error({ title: "Gagal", description: "Gagal mengubah status berita" });
    }
  };

  const handleDelete = async () => {
    const confirmed = await modal.confirm({
      title: "Hapus Berita?",
      description: "Berita yang dihapus tidak dapat dikembalikan.",
      confirmText: "Hapus",
      cancelText: "Batal",
      confirmButtonVariant: "danger",
    });

    if (!confirmed) return;

    modal.loading({ title: "Menghapus..." });
    try {
      const response = await fetch(`/api/admin/berita/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus berita");
      }

      setOpen(false);
      modal.success({ title: "Berhasil!", description: "Berita berhasil dihapus." });
      onDeleted?.(id);
    } catch (error) {
      console.error(error);
      modal.error({ title: "Gagal", description: "Gagal menghapus berita" });
    }
  };

  return (
    <>
      <div className="w-10 flex-shrink-0 text-right">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleMenu}
          aria-label="Buka menu aksi"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            transition-all
            duration-300
            hover:bg-slate-100
            dark:hover:bg-white/10
          "
        >
          <MoreHorizontal
            size={18}
            className="text-slate-600 dark:text-slate-300"
          />
        </button>
      </div>

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
              border-slate-200
              bg-white
              shadow-xl
              dark:border-white/10
              dark:bg-dark-card
            "
          >
            <button
              type="button"
              onClick={() => {
                router.push(`/admin/berita/${id}`);
                setOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-sm
                font-medium
                text-slate-700
                transition-colors
                hover:bg-slate-50
                dark:text-slate-200
                dark:hover:bg-white/10
              "
            >
              <ExternalLink size={16} />
              Preview Berita
            </button>

            <button
              type="button"
              onClick={() => {
                router.push(`/admin/berita/${id}/edit`);
                setOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-sm
                font-medium
                text-slate-700
                transition-colors
                hover:bg-slate-50
                dark:text-slate-200
                dark:hover:bg-white/10
              "
            >
              <Pencil size={16} />
              Edit Berita
            </button>

            <button
              type="button"
              
              onClick={handleTogglePublished}
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-sm
                font-medium
                text-slate-700
                transition-colors
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:text-slate-200
                dark:hover:bg-white/10
              "
            >
              {published ? <EyeOff size={16} /> : <Eye size={16} />}

              {published ? "Jadikan Privat" : "Jadikan Publik"}
            </button>

            {role === "super_admin" && (
              <>
                <div className="h-px bg-slate-100 dark:bg-white/10" />

                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-600
                    transition-colors
                    hover:bg-red-50
                    dark:text-red-400
                    dark:hover:bg-red-950/40
                  "
                >
                  <Trash2 size={16} />
                  Hapus Berita
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
