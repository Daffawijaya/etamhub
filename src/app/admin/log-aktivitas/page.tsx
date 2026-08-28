"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  BarChart3,
  FileText,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import LoadingState from "@/components/LoadingState";

interface ActivityLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  target_type: string;
  target_id: string | null;
  target_name: string | null;
  detail: Record<string, any> | null;
  created_at: string;
}

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  approve_umkm: {
    label: "Menyetujui UMKM",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  reject_umkm: {
    label: "Menolak UMKM",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  approve_umkm_request_create: {
    label: "Menyetujui UMKM baru",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  approve_umkm_request_update: {
    label: "Menyetujui update UMKM",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  approve_umkm_request_delete: {
    label: "Menyetujui hapus UMKM",
    icon: Trash2,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  reject_umkm_request_create: {
    label: "Menolak UMKM baru",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  reject_umkm_request_update: {
    label: "Menolak update UMKM",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  reject_umkm_request_delete: {
    label: "Menolak hapus UMKM",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  add_monitoring: {
    label: "Menambah monitoring UMKM",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  publish_berita: {
    label: "Memublikasikan berita",
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  unpublish_berita: {
    label: "Menyembunyikan berita",
    icon: EyeOff,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  delete_berita: {
    label: "Menghapus berita",
    icon: Trash2,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  publish_umkm: {
    label: "Memublikasikan UMKM",
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  unpublish_umkm: {
    label: "Menyembunyikan UMKM",
    icon: EyeOff,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  admin_kecamatan: "Admin Kecamatan",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(iso);
}

export default function LogAktivitasPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterAction, setFilterAction] = useState("");
  const [searchName, setSearchName] = useState("");

  async function loadLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (filterAction) params.set("action", filterAction);

      const res = await fetch(`/api/admin/activity-logs?${params}`);
      const data = await res.json();

      if (res.ok) {
        setLogs(data.logs ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, [page, filterAction]);

  const filteredLogs = logs.filter((log) => {
    if (!searchName) return true;
    return log.actor_name
      .toLowerCase()
      .includes(searchName.toLowerCase());
  });

  if (loading && logs.length === 0) return <LoadingState />;

  return (
    <main className="px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Log Aktivitas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {total} aktivitas tercatat
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama admin..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-4 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
          />
        </div>

        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-200 pl-9 pr-8 text-sm appearance-none dark:border-slate-700 dark:bg-dark dark:text-white"
          >
            <option value="">Semua Aksi</option>
            {Object.entries(ACTION_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log List */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Belum ada aktivitas
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {filteredLogs.map((log) => {
              const config = ACTION_CONFIG[log.action] ?? {
                label: log.action,
                icon: FileText,
                color: "text-slate-600",
                bgColor: "bg-slate-50 dark:bg-slate-900/20",
              };
              const Icon = config.icon;

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}
                  >
                    <Icon size={18} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      <span className="font-semibold">{log.actor_name}</span>
                      <span className="mx-1.5 text-slate-400">·</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${config.bgColor} ${config.color}`}
                      >
                        {ROLE_LABELS[log.actor_role] ?? log.actor_role}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {config.label}
                      {log.target_name && (
                        <>
                          {" "}
                          <span className="font-medium text-slate-900 dark:text-white">
                            &ldquo;{log.target_name}&rdquo;
                          </span>
                        </>
                      )}
                    </p>
                    {log.detail?.reason && (
                      <p className="mt-1 text-xs text-slate-400">
                        Alasan: {log.detail.reason}
                      </p>
                    )}
                    {log.detail?.catatan && (
                      <p className="mt-1 text-xs text-slate-400">
                        Catatan: {log.detail.catatan}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-slate-400">
                      {timeAgo(log.created_at)}
                    </p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-500 mt-0.5">
                      {formatDate(log.created_at)}
                    </p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-500">
                      {formatTime(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-white/5"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-white/5"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
