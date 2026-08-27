"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Upload,
  Pencil,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Notification {
  id: string;
  type: "create" | "update" | "delete" | "import" | "verification" | "approval" | "rejection";
  title: string;
  link?: string;
  created_at: string;
  read: boolean;
}

const icons: Record<string, any> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  import: Upload,
  verification: ShieldCheck,
  approval: CheckCircle2,
  rejection: XCircle,
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
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
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

  const handleNotificationClick = async (item: Notification) => {
    setOpen(false);
    await markAsRead();

    if (item.link) {
      router.push(item.link);
    }
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
              animate-pulse
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {unreadCount} baru
                </span>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">Belum ada notifikasi</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((item) => {
                const Icon = icons[item.type] ?? Plus;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`
                      flex w-full items-center gap-3 px-5 py-4 text-left
                      transition-colors
                      hover:bg-gray-50 dark:hover:bg-neutral-800
                      ${!item.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}
                    `}
                  >
                    <div
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                        ${
                          item.type === "verification"
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : item.type === "approval"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : item.type === "rejection"
                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400"
                        }
                      `}
                    >
                      <Icon size={14} />
                    </div>

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
                        {getRelativeTime(item.created_at)}
                      </span>
                    </div>

                    {!item.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
