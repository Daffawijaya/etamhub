"use client";

export default function SystemInfoCard() {
  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-dark dark:text-light">
        Informasi Sistem
      </h2>

      <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <p>• Satu akun hanya dapat memiliki satu data UMKM berdasarkan NIK.</p>

        <p>
          • Setiap perubahan data UMKM akan melalui proses persetujuan admin.
        </p>

        <p>• UMKM yang telah disetujui akan tampil pada katalog publik.</p>
      </div>
    </div>
  );
}
