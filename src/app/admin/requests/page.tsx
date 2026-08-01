"use client";

import { useEffect, useState } from "react";

type RequestItem = {
  id: string;
  action: "update" | "delete";
  status: string;
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

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    const res = await fetch("/api/admin/umkm-requests");
    const data = await res.json();

    setRequests(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequest(id: string, action: "approve" | "reject") {
    const reason = action === "reject" ? prompt("Alasan penolakan") : null;

    await fetch(`/api/admin/umkm-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        reason,
      }),
    });

    loadRequests();
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Approval UMKM</h1>

      <div className="space-y-4">
        {requests.map((item) => (
          <div key={item.id} className="rounded-xl border p-5">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{item.umkm?.nama}</h2>

                <p className="text-sm text-gray-500">Request: {item.action}</p>

                <p className="text-sm">Oleh: {item.creator?.name}</p>
              </div>

              <span className="text-sm">{item.status}</span>
            </div>

            {item.action === "update" && (
              <div className="mt-4">
                <h3 className="font-medium">Data perubahan</h3>

                <pre className="mt-2 overflow-auto rounded dark:bg-dark p-3 text-xs">
                  {JSON.stringify(item.payload, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {item.status === "pending" && (
                <>
                  <button
                    onClick={() => updateRequest(item.id, "approve")}
                    className="rounded bg-green-600 px-4 py-2 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateRequest(item.id, "reject")}
                    className="rounded bg-red-600 px-4 py-2 text-white"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
