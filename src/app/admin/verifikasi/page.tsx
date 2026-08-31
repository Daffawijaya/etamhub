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
    nama?: string;
    pemilik?: string;
    kategori?: string;
    subkategori?: string;
    kecamatan?: string;
    gambar?: string[];
    before?: Record<string, any>;
    after?: Record<string, any>;
    [key: string]: any;
  };
  created_at: string;
}

const LABEL_MAP: Record<string, string> = {
  nama: "Nama",
  pemilik: "Pemilik",
  kategori: "Kategori",
  subkategori: "Subkategori",
  deskripsi: "Deskripsi",
  kecamatan: "Kecamatan",
  alamat: "Alamat",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  nib: "NIB",
  kbli: "KBLI",
  npwp: "NPWP",
  halal: "Halal",
  pirt: "PIRT",
  haki: "HAKI",
  tahun_mulai_usaha: "Tahun Mulai Usaha",
  jumlah_tenaga_kerja: "Jumlah TK",
  omzet: "Omzet",
  gambar: "Gambar",
  lat: "Latitude",
  lng: "Longitude",
};

function formatVal(v: unknown) {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : "-";
  return String(v);
}

function getChangedFields(before: Record<string, any>, after: Record<string, any>) {
  const IGNORED = ["id", "owner_id", "created_at", "updated_at", "approval_status", "approved_at", "approved_by", "published"];
  return Object.keys(after).filter(
    (k) => !IGNORED.includes(k) && JSON.stringify(before[k]) !== JSON.stringify(after[k]),
  );
}

export default function VerifikasiPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      if (reason === null) return;
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
      alert(error instanceof Error ? error.message : "Gagal memproses");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <main className="min-h-screen bg-light dark:bg-dark">
      <div className="h-fit overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4 dark:border-neutral-800">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Verifikasi UMKM
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {requests.length} menunggu verifikasi
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              ✓
            </div>
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Tidak ada request</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Semua request UMKM sudah diproses.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {requests.map((item) => {
              const payload = item.payload;
              const isEdit = item.action === "edit";
              const gambar = isEdit ? payload?.after?.gambar : payload?.gambar;
              const nama = isEdit ? payload?.after?.nama : payload?.nama;
              const pemilik = isEdit ? payload?.before?.pemilik : payload?.pemilik;
              const kecamatan = isEdit ? payload?.before?.kecamatan : payload?.kecamatan;
              const kategori = isEdit ? payload?.before?.kategori : payload?.kategori;
              const isExpanded = expandedId === item.id;

              const changedFields = isEdit && payload?.before && payload?.after
                ? getChangedFields(payload.before, payload.after)
                : [];

              return (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    {/* Gambar */}
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={getUmkmImage(gambar)}
                        alt={nama ?? "UMKM"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white capitalize">
                          {nama}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isEdit
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        }`}>
                          {isEdit ? "Edit" : "Baru"}
                        </span>
                      </div>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {pemilik} · {kecamatan} · {kategori}
                      </p>
                      {isEdit && changedFields.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="mt-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {isExpanded ? "Sembunyikan" : `Lihat ${changedFields.length} perubahan`}
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item.id, "approve")}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:px-4 sm:text-sm"
                      >
                        {processingId === item.id ? "..." : "Setujui"}
                      </button>
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item.id, "reject")}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50 sm:px-4 sm:text-sm"
                      >
                        {processingId === item.id ? "..." : "Tolak"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded diff for edit requests */}
                  {isEdit && isExpanded && changedFields.length > 0 && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-4 dark:bg-white/[0.03] sm:ml-[70px]">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Perubahan:</p>
                      <div className="space-y-2">
                        {changedFields.map((field) => (
                          <div key={field} className="flex items-start gap-2 text-xs">
                            <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">
                              {LABEL_MAP[field] ?? field}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-red-500 line-through">
                                {formatVal(payload.before?.[field])}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {formatVal(payload.after?.[field])}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
