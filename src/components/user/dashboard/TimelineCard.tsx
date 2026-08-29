"use client";

import { CheckCircle2, Clock3, XCircle, AlertCircle } from "lucide-react";

type TimelineItem = {
  title: string;
  date: string;
  status: string;
  reason?: string;
};

type Props = {
  timeline: TimelineItem[];
};

export default function TimelineCard({ timeline }: Props) {
  function getIcon(status: string) {
    switch (status) {
      case "done":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "current":
        return <Clock3 size={16} className="text-blue-500" />;
      case "rejected":
        return <XCircle size={16} className="text-red-500" />;
      case "revision":
        return <AlertCircle size={16} className="text-amber-500" />;
      default:
        return <Clock3 size={16} className="text-slate-400" />;
    }
  }

  function formatDate(date: string) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Riwayat Pengajuan
      </h2>

      {timeline.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-white/[0.06]">
          <Clock3 size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Belum ada riwayat
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Riwayat akan muncul setelah Anda mengirim pengajuan.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-0">
          {timeline.map((item, index) => (
            <div key={index} className="relative flex gap-3 pb-5 last:pb-0">
              {/* Vertical line */}
              {index < timeline.length - 1 && (
                <div className="absolute left-[7px] top-5 h-full w-px bg-slate-100 dark:bg-white/[0.06]" />
              )}
              <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                {getIcon(item.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(item.date)}
                </p>
                {item.reason && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {item.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
