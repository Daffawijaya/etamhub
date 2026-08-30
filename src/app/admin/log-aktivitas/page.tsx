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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingState from "@/components/LoadingState";
import CustomSelect from "@/components/ui/CustomSelect";

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



export default function LogAktivitasPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [page, filterAction, filterActor]);

  const filteredLogs = logs;

  return (
    <div className="pb-6 px-6">
      <div className="rounded-xl bg-white transition-colors duration-300 dark:bg-dark-card">
        {/* Header — matches berita/umkm page style */}
        <div className="px-6 pt-5 pb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Log Aktivitas
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {total} aktivitas tercatat
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3">
            <CustomSelect
              value={filterActor}
              onChange={(v) => {
                setFilterActor(v);
                setPage(1);
              }}
              placeholder="Semua Admin"
              options={actors.map((a) => ({
                value: a.actor_id,
                label: a.actor_name,
              }))}
              className="w-56"
            />
            <CustomSelect
              value={filterAction}
              onChange={(v) => {
                setFilterAction(v);
                setPage(1);
              }}
              placeholder="Semua Aksi"
              options={Object.entries(ACTION_CONFIG).map(([key, config]) => ({
                value: key,
                label: config.label,
              }))}
              className="w-56"
            />
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
                  className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
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
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${ROLE_COLORS[log.actor_role] ?? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 dark:border-white/[0.06] dark:hover:bg-white/[0.05]"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 dark:border-white/[0.06] dark:hover:bg-white/[0.05]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
