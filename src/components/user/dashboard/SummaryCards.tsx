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
      value: data.status.approval_label,
      description: "Status pengajuan UMKM",
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 dark:bg-dark-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>

                <h2 className="mt-2 text-2xl font-bold text-dark dark:text-light">
                  {item.value}
                </h2>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <Icon size={24} className="text-primary" />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
