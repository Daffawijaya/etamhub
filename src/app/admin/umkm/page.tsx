"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Umkm = {
  id: number;
  nama: string;
  kategori: string;
  kecamatan: string;
};

export default function AdminUmkmPage() {
  const [umkms, setUmkms] = useState<Umkm[]>([]);

  async function getUmkm() {
    const res = await fetch("/api/umkm");
    const data = await res.json();

    setUmkms(data);
  }

  async function deleteUmkm(id: number) {
    const yakin = confirm("Hapus UMKM ini?");

    if (!yakin) return;

    await fetch(`/api/umkm/${id}`, {
      method: "DELETE",
    });

    getUmkm();
  }

  useEffect(() => {
    getUmkm();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Data UMKM</h1>
      <Link
        href="/admin/tambah"
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        Tambah UMKM
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="border bg-gray-100">
              <th className="p-3 text-left">Nama</th>

              <th className="p-3 text-left">Kategori</th>

              <th className="p-3 text-left">Kecamatan</th>

              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {umkms.map((u) => (
              <tr key={u.id} className="border">
                <td className="p-3">{u.nama}</td>

                <td className="p-3">{u.kategori}</td>

                <td className="p-3">{u.kecamatan}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/edit/${u.id}`}
                      className="px-3 py-1 rounded bg-amber-500 text-white"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteUmkm(u.id)}
                      className="px-3 py-1 rounded bg-red-500 text-white"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
