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
        return <CheckCircle2 size={20} className="text-green-500" />;

      case "current":
        return <Clock3 size={20} className="text-primary" />;

      case "rejected":
        return <XCircle size={20} className="text-red-500" />;

      case "revision":
        return <AlertCircle size={20} className="text-yellow-500" />;

      default:
        return <Clock3 size={20} className="text-primary" />;
    }
  }

  function formatDate(date: string) {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-dark dark:text-light">
        Riwayat Pengajuan
      </h2>

      {timeline.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <Clock3 size={36} className="mx-auto text-gray-400" />

          <p className="mt-3 font-medium text-dark dark:text-light">
            Belum ada riwayat pengajuan
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Riwayat akan muncul setelah Anda mengirim pengajuan.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-3">
              {getIcon(item.status)}

              <div className="flex-1">
                <p className="font-medium text-dark dark:text-light">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(item.date)}
                </p>

                {item.reason && (
                  <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
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
