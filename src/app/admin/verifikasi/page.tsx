"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { getUmkmImage } from "@/lib/getUmkmImage";

interface PendingRequest {
  id: string;
  user_id: string;
  action: string;
  status: string;
  payload: {
    nama: string;
    pemilik?: string;
    kategori?: string;
    subkategori?: string;
    kecamatan?: string;
    gambar?: string[];
    [key: string]: any;
  };
  created_at: string;
}

export default function VerifikasiPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function loadPending() {
    try {
      const res = await fetch("/api/admin/umkm-verify");
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setRequests(result.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    let reason: string | null = null;

    if (action === "reject") {
      reason = prompt("Alasan penolakan (opsional):");
      if (reason === null) return; // User cancelled
    }

    setProcessingId(id);

    try {
      const res = await fetch(`/api/admin/umkm-verify/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Gagal memproses",
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <main className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Verifikasi UMKM
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {requests.length} UMKM menunggu verifikasi
          </p>
        </div>

        {requests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {requests.map((item) => {
              const payload = item.payload;
              const gambar = payload?.gambar;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  {/* Gambar */}
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={getUmkmImage(gambar)}
                      alt={payload?.nama ?? "UMKM"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white capitalize">
                      {payload?.nama}
                    </h3>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {payload?.pemilik} · {payload?.kecamatan} ·{" "}
                      {payload?.kategori}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "approve")}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {processingId === item.id ? "..." : "Setujui"}
                    </button>
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "reject")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {processingId === item.id ? "..." : "Tolak"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
