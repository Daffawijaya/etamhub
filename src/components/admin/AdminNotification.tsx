"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Download, Pencil, Plus, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: "create" | "update" | "delete" | "import";
  title: string;
  createdAt: string;
  read: boolean;
}

const icons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  import: Download,
};

function getRelativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;

  return `${Math.floor(months / 12)} tahun lalu`;
}

export default function AdminNotification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      setNotifications(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    await fetch("/api/notifications/read", {
      method: "PATCH",
    });

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      })),
    );
  }, [unreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [open, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (open) {
          setOpen(false);
          markAsRead();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, markAsRead]);

  const handleOpen = async () => {
    if (open) {
      await markAsRead();
    }

    setOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleOpen}
        className="
          relative flex h-12 w-12 items-center justify-center
          rounded-2xl bg-white text-slate-900 transition-all duration-200
          hover:bg-slate-50
          dark:bg-dark-card dark:text-white dark:hover:bg-neutral-800
        "
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center
              rounded-full bg-red-500 text-[11px] font-medium text-white
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-[9999] mt-3 w-80 overflow-hidden rounded-2xl
            bg-white shadow-xl ring-1 ring-black/5
            animate-in fade-in zoom-in-95 duration-200
            dark:bg-dark-card dark:ring-white/10
          "
        >
          <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifikasi
            </h3>
          </div>

          {notifications.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">Belum ada notifikasi</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((item) => {
                const Icon = icons[item.type];

                return (
                  <div
                    key={item.id}
                    className="
                      flex items-center gap-3 px-5 py-4
                      transition-colors
                      hover:bg-gray-50 dark:hover:bg-neutral-800
                    "
                  >
                    <Icon size={16} className="shrink-0 text-gray-500" />

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <p
                        className={`flex-1 break-words text-sm font-medium ${
                          item.read
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </p>

                      <span
                        className="
                          shrink-0 whitespace-nowrap
                          text-xs text-gray-500 dark:text-gray-400
                        "
                      >
                        {getRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
