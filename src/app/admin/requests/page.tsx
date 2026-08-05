"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import RequestRow, {
  type RequestItem,
} from "@/components/admin/request/RequestRow";

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      const response = await fetch("/api/admin/umkm-requests");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setRequests(result);
    } catch (error) {
      console.error(error);
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
        throw new Error("Gagal memproses request");
      }

      await loadRequests();
    } catch (error) {
      console.error(error);
      alert("Gagal memproses request.");
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  const pendingCount = requests.filter(
    (item) => item.status === "pending",
  ).length;

  return (
    <main className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daftar Request
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pendingCount} request belum dikonfirmasi
          </p>
        </div>

        {requests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {requests.map((item) => (
              <RequestRow key={item.id} item={item} onUpdate={updateRequest} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
