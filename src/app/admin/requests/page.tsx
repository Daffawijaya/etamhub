"use client";

import { useEffect, useState } from "react";

type RequestAction = "update" | "delete";
type RequestStatus = "pending" | "approved" | "rejected";

type RequestItem = {
  id: string;
  action: RequestAction;
  status: RequestStatus;
  payload: Record<string, any>;
  created_at: string;
  umkm: {
    id: string;
    nama: string;
    kategori: string;
    kecamatan: string;
    gambar: string[];
  } | null;
  creator: {
    name: string;
    email: string;
  } | null;
};

type RequestDetailProps = {
  item: RequestItem;
};

const IGNORED_FIELDS = [
  "id",
  "owner_id",
  "created_at",
  "updated_at",
  "approval_status",
  "approved_at",
  "approved_by",
];

function formatAction(action: RequestAction) {
  const labels: Record<RequestAction, string> = {
    update: "Update",
    delete: "Hapus",
  };

  return labels[action] ?? action;
}

function formatStatus(status: RequestStatus) {
  const labels: Record<RequestStatus, string> = {
    pending: "Pending",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return labels[status] ?? status;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyle(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";

    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";

    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300";
  }
}

function getActionStyle(action: RequestAction) {
  switch (action) {
    case "update":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";

    case "delete":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatFieldName(field: string) {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatValue(value: any) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "-";
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getChangedFields(payload: Record<string, any>) {
  const before = payload?.before;
  const after = payload?.after;

  if (!before || !after) {
    return null;
  }

  return Object.keys(after).filter(
    (key) =>
      !IGNORED_FIELDS.includes(key) &&
      JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );
}

function RequestDetail({ item }: RequestDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const before = item.payload?.before;
  const after = item.payload?.after;

  const changedFields =
    item.action === "update" ? getChangedFields(item.payload) : null;

  const hasComparison = Boolean(before && after);

  if (item.action === "delete") {
    return (
      <div className="border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
          UMKM ini akan dihapus apabila request disetujui.
        </div>
      </div>
    );
  }

  if (!hasComparison) {
    return (
      <div className="border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
        <p className="mb-2 text-sm font-medium">Data perubahan</p>

        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700 dark:bg-neutral-900 dark:text-gray-300">
          {JSON.stringify(item.payload, null, 2)}
        </pre>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="border-t border-gray-100 px-5 py-3 dark:border-neutral-800">
        <button
          onClick={() => setExpanded(true)}
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Lihat {changedFields?.length ?? 0} perubahan →
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Perubahan Data</h3>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {changedFields?.length ?? 0} field mengalami perubahan
          </p>
        </div>

        <button
          onClick={() => setExpanded(false)}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Tutup
        </button>
      </div>

      {changedFields && changedFields.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
          <div className="grid grid-cols-[140px_1fr_1fr] bg-gray-50 text-xs font-medium text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
            <div className="px-4 py-3">Field</div>
            <div className="px-4 py-3">Sebelum</div>
            <div className="px-4 py-3">Sesudah</div>
          </div>

          {changedFields.map((key) => (
            <div
              key={key}
              className="grid grid-cols-[140px_1fr_1fr] border-t border-gray-200 text-sm dark:border-neutral-800"
            >
              <div className="px-4 py-3 font-medium">
                {formatFieldName(key)}
              </div>

              <div className="break-words px-4 py-3 text-gray-500 dark:text-gray-400">
                {formatValue(before[key])}
              </div>

              <div className="break-words bg-amber-50/70 px-4 py-3 font-medium dark:bg-amber-900/10">
                {formatValue(after[key])}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
          Tidak ada perubahan data.
        </div>
      )}
    </div>
  );
}

type RequestRowProps = {
  item: RequestItem;
  onUpdate: (id: string, action: "approve" | "reject") => void;
};

function RequestRow({ item, onUpdate }: RequestRowProps) {
  const isPending = item.status === "pending";

  return (
    <div className="group">
      <div className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 dark:hover:bg-neutral-900/40 md:flex-row md:items-center md:justify-between">
        {/* Informasi UMKM */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
              {item.umkm?.nama?.charAt(0)?.toUpperCase() ?? "?"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold text-gray-900 dark:text-white">
                {item.umkm?.nama ?? "-"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{item.umkm?.kategori ?? "-"}</span>

                <span>•</span>

                <span>{item.umkm?.kecamatan ?? "-"}</span>

                <span>•</span>

                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Status */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${getActionStyle(
              item.action,
            )}`}
          >
            {formatAction(item.action)}
          </span>

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${getStatusStyle(
              item.status,
            )}`}
          >
            {formatStatus(item.status)}
          </span>

          {isPending && (
            <>
              <button
                onClick={() => onUpdate(item.id, "approve")}
                className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Setujui
              </button>

              <button
                onClick={() => onUpdate(item.id, "reject")}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
              >
                Tolak
              </button>
            </>
          )}
        </div>
      </div>

      {item.action === "update" && <RequestDetailContent item={item} />}

      {item.action === "delete" && isPending && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-400">
            Request penghapusan menunggu persetujuan admin.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Tombol detail dipisahkan supaya row utama tetap sederhana.
 */

/**
 * Isi detail perubahan.
 *
 * State expand sebenarnya berada di component ini agar
 * tombol Detail dan isi detail tetap satu sumber state.
 */
function RequestDetailContent({ item }: RequestDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const before = item.payload?.before;
  const after = item.payload?.after;

  const changedFields = getChangedFields(item.payload);

  if (!before || !after) {
    return (
      <div className="border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
        <p className="mb-2 text-sm font-medium">Data perubahan</p>

        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 text-xs dark:bg-neutral-900">
          {JSON.stringify(item.payload, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-gray-100 px-5 py-3 dark:border-neutral-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {expanded
            ? "Sembunyikan perubahan ↑"
            : `Lihat ${changedFields?.length ?? 0} perubahan →`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 dark:border-neutral-800">
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
            <div className="grid grid-cols-[140px_1fr_1fr] bg-gray-50 text-xs font-medium text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
              <div className="px-4 py-3">Field</div>
              <div className="px-4 py-3">Sebelum</div>
              <div className="px-4 py-3">Sesudah</div>
            </div>

            {changedFields?.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[140px_1fr_1fr] border-t border-gray-200 text-sm dark:border-neutral-800"
              >
                <div className="px-4 py-3 font-medium">
                  {formatFieldName(key)}
                </div>

                <div className="break-words px-4 py-3 text-gray-500 dark:text-gray-400">
                  {formatValue(before[key])}
                </div>

                <div className="break-words bg-amber-50/70 px-4 py-3 font-medium dark:bg-amber-900/10">
                  {formatValue(after[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function LoadingState() {
  return (
    <div className="px-6 pb-6">
      <div>
        <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 border-b border-gray-100 px-5 py-5 last:border-0 dark:border-neutral-800"
            >
              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                <div className="h-3 w-64 animate-pulse rounded bg-gray-100 dark:bg-neutral-900" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
        ✓
      </div>

      <h2 className="mt-4 font-semibold">Tidak ada request</h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Semua request UMKM sudah diproses.
      </p>
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      const response = await fetch("/api/admin/umkm-requests");

      if (!response.ok) {
        throw new Error("Gagal mengambil data request");
      }

      const data = await response.json();

      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequest(id: string, action: "approve" | "reject") {
    const reason = action === "reject" ? prompt("Alasan penolakan") : null;

    if (action === "reject" && !reason) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/umkm-requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui request");
      }

      await loadRequests();
    } catch (error) {
      console.error("Failed to update request:", error);
      alert("Gagal memproses request.");
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <main className="px-6 pb-6">
      <div className="">
        {/* Header */}

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <h2
                className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                transition-colors
                duration-300
              "
              >
                Daftar Request
              </h2>

              <p
                className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
                transition-colors
                duration-300 capitalize
              "
              >
                {requests.filter((item) => item.status === "pending").length}{" "}
                request belum dikonfirmasi
              </p>
            </div>
          </div>

          {/* List */}
          {requests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {requests.map((item) => (
                <RequestRow
                  key={item.id}
                  item={item}
                  onUpdate={updateRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
