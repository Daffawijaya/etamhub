"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface AdminKecamatan {
  id: string;
  nama: string;
  username: string;
  is_active: boolean;
  created_at: string;
  kecamatan: string[];
}

interface KecamatanOption {
  id: string;
  nama: string;
}

export default function AdminKecamatanPage() {
  const [admins, setAdmins] = useState<AdminKecamatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminKecamatan | null>(null);
  const [kecamatanOptions, setKecamatanOptions] = useState<KecamatanOption[]>([]);

  // Form state
  const [formNama, setFormNama] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formKecamatanIds, setFormKecamatanIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const [adminsRes, kecRes] = await Promise.all([
        fetch("/api/admin/admin-kecamatan"),
        fetch("/api/kecamatan"),
      ]);

      const adminsData = await adminsRes.json();
      const kecData = await kecRes.json();

      if (adminsRes.ok) setAdmins(adminsData);
      setKecamatanOptions(kecData ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openForm(admin?: AdminKecamatan) {
    if (admin) {
      setEditing(admin);
      setFormNama(admin.nama);
      setFormUsername(admin.username);
      setFormPassword("");
      // Map kecamatan names back to IDs
      const ids = kecamatanOptions
        .filter((k) => admin.kecamatan.includes(k.nama))
        .map((k) => k.id);
      setFormKecamatanIds(ids);
    } else {
      setEditing(null);
      setFormNama("");
      setFormUsername("");
      setFormPassword("");
      setFormKecamatanIds([]);
    }
    setShowForm(true);
  }

  function toggleKecamatan(id: string) {
    setFormKecamatanIds((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (!formNama || !formUsername) {
      alert("Nama dan username wajib diisi");
      return;
    }

    if (!editing && !formPassword) {
      alert("Password wajib diisi untuk akun baru");
      return;
    }

    if (formKecamatanIds.length === 0) {
      alert("Minimal pilih 1 kecamatan");
      return;
    }

    setSaving(true);

    try {
      const payload: Record<string, any> = {
        nama: formNama,
        username: formUsername,
        kecamatanIds: formKecamatanIds,
      };

      if (formPassword) payload.password = formPassword;

      const url = editing
        ? `/api/admin/admin-kecamatan/${editing.id}`
        : "/api/admin/admin-kecamatan";

      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setShowForm(false);
      setEditing(null);
      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus admin kecamatan ini?")) return;

    try {
      const res = await fetch(`/api/admin/admin-kecamatan/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus");
    }
  }

  async function handleToggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/admin-kecamatan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current }),
      });

      if (!res.ok) throw new Error("Gagal update");

      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal update");
    }
  }

  if (loading) return <LoadingState />;

  return (
    <main className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Kecamatan
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Kelola akun admin kecamatan
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={16} />
            Tambah Admin
          </button>
        </div>

        {admins.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                    {admin.nama}
                  </h3>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    @{admin.username} ·{" "}
                    {admin.kecamatan.length > 0
                      ? admin.kecamatan.join(", ")
                      : "Belum ada kecamatan"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    admin.is_active
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-slate-400"
                  }`}
                >
                  {admin.is_active ? "Aktif" : "Nonaktif"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openForm(admin)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleActive(admin.id, admin.is_active)
                    }
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {admin.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {editing ? "Edit Admin Kecamatan" : "Tambah Admin Kecamatan"}
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nama
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  placeholder="Username untuk login"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password {editing && "(kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kecamatan
                </label>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-dark">
                  {kecamatanOptions.map((kec) => (
                    <label
                      key={kec.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={formKecamatanIds.includes(kec.id)}
                        onChange={() => toggleKecamatan(kec.id)}
                        className="rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {kec.nama}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : editing ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
