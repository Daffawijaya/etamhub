"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { id } = await params;

      const res = await fetch(
        `/api/umkm/${id}`
      );

      const data = await res.json();

      setForm(data);
    }

    load();
  }, [params]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { id } = await params;

    await fetch(`/api/umkm/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(form),
    });

    router.push("/admin/umkm");
  }

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-3xl"
    >
      <h1 className="text-2xl font-bold">
        Edit UMKM
      </h1>

      <input
        className="w-full border p-3 rounded"
        value={form.nama}
        onChange={(e) =>
          setForm({
            ...form,
            nama: e.target.value,
          })
        }
      />

      <input
        className="w-full border p-3 rounded"
        value={form.pemilik}
        onChange={(e) =>
          setForm({
            ...form,
            pemilik: e.target.value,
          })
        }
      />

      <textarea
        className="w-full border p-3 rounded h-40"
        value={form.deskripsi}
        onChange={(e) =>
          setForm({
            ...form,
            deskripsi: e.target.value,
          })
        }
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}