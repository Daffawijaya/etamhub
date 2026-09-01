"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/components/ui/modal";
import BrandButton from "@/components/ui/BrandButton";

interface Account {
  id: string;
  nama: string;
  username: string | null;
  nik: string | null;
  roles: {
    name: string;
  };
  user_kecamatan: {
    kecamatan: {
      nama: string;
    };
  }[];
}

export default function AccountTable() {
  const [users, setUsers] = useState<Account[]>([]);
  const [resetId, setResetId] = useState<string | null>(null);
  const modal = useModal();
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);
  async function resetPassword(id: string) {
    const password = prompt("Masukkan password baru");

    if (!password) return;

    const res = await fetch(`/api/users/${id}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Password berhasil diubah");
  }

  async function deleteUser(id: string) {
    const confirmed = await modal.confirm({
      title: "Hapus Akun?",
      description: "Akun ini akan dihapus permanen.",
      confirmText: "Hapus",
      cancelText: "Batal",
      confirmButtonVariant: "danger",
    });

    if (!confirmed) return;

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    modal.success({ title: "Tersimpan", description: "Akun berhasil dihapus." });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-neutral-800">
            <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Nama</th>
            <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Login</th>
            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
            <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Kecamatan</th>
            <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900 dark:text-white">{user.nama}</p>
                <p className="sm:hidden text-xs text-slate-500 dark:text-slate-400">{user.username ?? user.nik}</p>
              </td>

              <td className="hidden sm:table-cell px-4 py-3 text-slate-600 dark:text-slate-300">{user.username ?? user.nik}</td>

              <td className="hidden md:table-cell px-4 py-3 text-slate-600 dark:text-slate-300">{user.roles.name}</td>

              <td className="hidden lg:table-cell px-4 py-3 text-slate-600 dark:text-slate-300">
                {user.user_kecamatan?.map((item) => item.kecamatan.nama).join(", ") || "-"}
              </td>

              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <BrandButton variant="ghost" size="xs" onClick={() => resetPassword(user.id)} className="text-brand-primary hover:text-brand-primary/80">
                    Reset
                  </BrandButton>
                  <BrandButton variant="ghost" size="xs" onClick={() => deleteUser(user.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40">
                    Hapus
                  </BrandButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
