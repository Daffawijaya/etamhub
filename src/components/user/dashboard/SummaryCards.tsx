"use client";

import { Building2, ClipboardCheck, Clock3, Globe2 } from "lucide-react";

type Props = {
  data: {
    umkm: {
      nama: string;
    } | null;

    status: {
      approval_label: string;
      published: boolean;
      hasPendingEdit?: boolean;
    };

    completeness: {
      percentage: number;
      filled: number;
      total: number;
    };
  };
};

export default function SummaryCards({ data }: Props) {
  const stats = [
    {
      title: "UMKM Saya",
      value: data.umkm?.nama ?? "-",
      description: data.umkm ? "Usaha sudah terdaftar" : "Belum memiliki UMKM",
      icon: Building2,
    },
    {
      title: "Status Pengajuan",
      value: data.status.hasPendingEdit ? "Edit Diverifikasi" : data.status.approval_label,
      description: data.status.hasPendingEdit ? "Perubahan data sedang diverifikasi" : "Status pengajuan UMKM",
      icon: Clock3,
    },
    {
      title: "Publikasi",
      value: data.status.published ? "Sudah Tampil" : "Belum Tampil",
      description: data.status.published
        ? "UMKM sudah tampil pada katalog"
        : "Menunggu persetujuan admin",
      icon: Globe2,
    },
    {
      title: "Kelengkapan Data",
      value: `${data.completeness.percentage}%`,
      description: `${data.completeness.filled}/${data.completeness.total} data terisi`,
      icon: ClipboardCheck,
    },
  ];

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl p-8 text-white
        bg-gradient-to-br
        from-[#ff7a59]
        via-[#ff6b7d]
        to-[#ff4fa3]
        dark:from-[#1b1027]
        dark:via-[#21152f]
        dark:to-[#130f1d]
        transition-all
        duration-500
        ease-in-out
      "
    >
      {/* Decorative blurs */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#ff4fa3]/20" />
      <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#1184CA]/20" />

      <div className="relative">
        {/* Hero stat */}
        <div className="flex items-start justify-between">
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md dark:bg-white/10">
            <Building2 size={24} />
          </div>
          <div className="text-right">
            <p className="text-white/70">UMKM Saya</p>
            <h2 className="text-4xl font-bold leading-none">
              {data.umkm?.nama ?? "-"}
            </h2>
            <p className="mt-1 text-white/70">
              {data.umkm ? "Usaha sudah terdaftar" : "Belum memiliki UMKM"}
            </p>
          </div>
        </div>

        {/* Sub stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {stats.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm dark:bg-white/5 dark:border dark:border-white/10"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={16} />
                  <span className="text-sm text-white/80">{item.title}</span>
                </div>
                <p className="text-lg font-bold">{item.value}</p>
                <p className="mt-1 text-xs text-white/60">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
