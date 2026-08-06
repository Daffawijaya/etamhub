"use client";

import { Clock3 } from "lucide-react";

type Props = {
  status: {
    approval_status: string | null;
    approval_label: string;
    published: boolean;
  };
};

export default function StatusCard({ status }: Props) {
  const description =
    status.approval_status === "approved"
      ? "Data UMKM telah disetujui oleh admin."
      : status.approval_status === "rejected"
        ? "Pengajuan UMKM ditolak. Silakan periksa kembali data usaha."
        : status.approval_status === "revision"
          ? "Data UMKM perlu diperbaiki sebelum dapat diproses kembali."
          : "Data UMKM sedang menunggu proses persetujuan admin.";

  const information =
    status.approval_status === "approved"
      ? status.published
        ? "UMKM telah tampil pada katalog publik."
        : "UMKM telah disetujui dan menunggu publikasi."
      : status.approval_status === "rejected"
        ? "Silakan lakukan perbaikan kemudian kirim ulang pengajuan."
        : status.approval_status === "revision"
          ? "Lengkapi data yang diminta admin kemudian kirim kembali."
          : "Setelah disetujui, usaha akan otomatis tampil pada katalog publik.";

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <div className="flex items-center gap-3">
        <Clock3 size={24} className="text-primary" />

        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-light">
            Status Usaha
          </h2>

          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-primary/5 p-4">
        <p className="text-sm font-medium text-dark dark:text-light">
          {status.approval_label}
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {information}
        </p>
      </div>
    </div>
  );
}
