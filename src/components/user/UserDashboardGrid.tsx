"use client";

import { Building2, Clock3, FileCheck2, UserRound } from "lucide-react";

export default function UserDashboardGrid() {
  const stats = [
    {
      title: "Data UMKM",
      value: "Belum Ada",
      description: "Daftarkan usaha Anda",
      icon: Building2,
    },
    {
      title: "Status Pengajuan",
      value: "Pending",
      description: "Menunggu verifikasi admin",
      icon: Clock3,
    },
    {
      title: "Status Data",
      value: "Lengkap",
      description: "Data usaha sudah sesuai",
      icon: FileCheck2,
    },
    {
      title: "Profil Pemilik",
      value: "Aktif",
      description: "Data akun dan NIK terhubung",
      icon: UserRound,
    },
  ];

  return (
    <div className="space-y-6">
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
                  <Icon className="text-primary" size={24} />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
        <h2 className="text-lg font-semibold text-dark dark:text-light">
          Informasi Akun
        </h2>

        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • Satu akun hanya dapat memiliki satu data UMKM berdasarkan NIK.
          </p>
          <p>• Perubahan data UMKM akan masuk proses persetujuan admin.</p>
          <p>• Setelah disetujui, data UMKM akan tampil di katalog publik.</p>
        </div>
      </div>
    </div>
  );
}
