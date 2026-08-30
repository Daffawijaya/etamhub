"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/components/ui/modal";

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
    <div
      className="
      overflow-hidden
      rounded-xl
      border
      "
    >
      <table className="w-full">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Login</th>
            <th>Role</th>
            <th>Kecamatan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nama}</td>

              <td>{user.username ?? user.nik}</td>

              <td>{user.roles.name}</td>

              <td>
                {user.user_kecamatan
                  ?.map((item) => item.kecamatan.nama)
                  .join(", ") || "-"}
              </td>

              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="
 text-sm
 text-red-500
 "
                >
                  Hapus
                </button>
                <button
                  onClick={() => resetPassword(user.id)}
                  className="text-sm text-violet-500"
                >
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
