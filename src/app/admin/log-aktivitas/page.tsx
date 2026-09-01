"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingState from "@/components/LoadingState";
import UmkmSearch from "@/components/admin/UmkmSearch";
import LogFilters from "@/components/admin/log/LogFilters";

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

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  admin: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  admin_kecamatan: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
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

const actionOptions = Object.entries(ACTION_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.label,
}));

export default function LogAktivitasPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterAction, setFilterAction] = useState("");
  const [filterActor, setFilterActor] = useState("");
  const [actors, setActors] = useState<{ actor_id: string; actor_name: string; actor_role: string }[]>([]);

  async function loadActors() {
    try {
      const res = await fetch("/api/admin/activity-logs/actors");
      const data = await res.json();
      if (res.ok) setActors(data.actors ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.set("search", search);
      if (filterAction) params.set("action", filterAction);
      if (filterActor) params.set("actor_id", filterActor);

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
    loadActors();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, search, filterAction, filterActor]);

  const filteredLogs = logs;

  return (
    <div>
      <div className="rounded-xl bg-white transition-colors duration-300 dark:bg-dark-card">
        {/* Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300 sm:text-2xl">
                Log Aktivitas
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300 sm:text-sm">
                {total} aktivitas tercatat
              </p>
            </div>

            {/* Search + Filter — right side */}
            <div className="flex items-center gap-2">
              <UmkmSearch
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
              />
              <LogFilters
                actors={actors}
                filterActor={filterActor}
                filterAction={filterAction}
                actionOptions={actionOptions}
                onActorChange={(v) => {
                  setFilterActor(v);
                  setPage(1);
                }}
                onActionChange={(v) => {
                  setFilterAction(v);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Log List */}
        {loading && logs.length === 0 ? (
          <div className="py-12">
            <LoadingState />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Belum ada aktivitas
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredLogs.map((log) => {
              const config = ACTION_CONFIG[log.action] ?? {
                label: log.action,
                icon: FileText,
                color: "text-slate-600",
                bgColor: "bg-slate-50 dark:bg-white/5",
              };
              const Icon = config.icon;

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/[0.02]"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${config.bgColor}`}
                  >
                    <Icon size={16} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-900 sm:text-sm dark:text-white">
                      <span className="font-semibold">{log.actor_name}</span>
                      <span className="mx-1 text-slate-400">·</span>
                      <span
                        className={`inline-flex items-center rounded-lg px-1.5 py-0.5 text-[10px] font-medium sm:rounded-full sm:px-2 sm:text-[11px] ${ROLE_COLORS[log.actor_role] ?? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}
                      >
                        {ROLE_LABELS[log.actor_role] ?? log.actor_role}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 sm:mt-1 sm:text-sm dark:text-slate-300">
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
                      <p className="mt-0.5 text-[11px] text-slate-400 sm:mt-1 sm:text-xs">
                        Alasan: {log.detail.reason}
                      </p>
                    )}
                    {log.detail?.catatan && (
                      <p className="mt-0.5 text-[11px] text-slate-400 sm:mt-1 sm:text-xs">
                        Catatan: {log.detail.catatan}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-slate-400 sm:text-xs">
                      {timeAgo(log.created_at)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-300 dark:text-slate-500 sm:text-[11px]">
                      {formatDate(log.created_at)}
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-500 sm:text-[11px]">
                      {formatTime(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 sm:h-9 sm:w-9 dark:border-white/[0.06] dark:hover:bg-white/[0.05]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 sm:h-9 sm:w-9 dark:border-white/[0.06] dark:hover:bg-white/[0.05]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
