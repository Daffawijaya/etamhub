"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Plus, Trash2, Edit2, Shield, Users } from "lucide-react";
import { useModal } from "@/components/ui/modal";
import BrandButton from "@/components/ui/BrandButton";

interface AdminAccount {
  id: string;
  nama: string;
  username: string;
  is_active: boolean;
  created_at: string;
  role: string;
  kecamatan: string[];
}

interface KecamatanOption {
  id: string;
  nama: string;
}

export default function AdminKecamatanPage() {
  const modal = useModal();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<"admin" | "admin_kecamatan" | null>(null);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [kecamatanOptions, setKecamatanOptions] = useState<KecamatanOption[]>([]);

  // Form state
  const [formNama, setFormNama] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formKecamatanIds, setFormKecamatanIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const isSuperAdmin = currentRole === "super_admin";
  const adminList = admins.filter((a) => a.role === "admin");
  const kecamatanList = admins.filter((a) => a.role === "admin_kecamatan");

  async function loadData() {
    try {
      const [roleRes, adminsRes, kecRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/admin-kecamatan"),
        fetch("/api/kecamatan"),
      ]);

      const roleData = await roleRes.json();
      setCurrentRole(roleData.role ?? null);

      const adminsData = await adminsRes.json();
      const kecData = await kecRes.json();

      if (adminsRes.ok && Array.isArray(adminsData)) setAdmins(adminsData);
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

  function openForm(role: "admin" | "admin_kecamatan", account?: AdminAccount) {
    if (account) {
      setEditing(account);
      setFormNama(account.nama);
      setFormUsername(account.username);
      setFormPassword("");
      const ids = kecamatanOptions
        .filter((k) => account.kecamatan.includes(k.nama))
        .map((k) => k.id);
      setFormKecamatanIds(ids);
    } else {
      setEditing(null);
      setFormNama("");
      setFormUsername("");
      setFormPassword("");
      setFormKecamatanIds([]);
    }
    setShowForm(role);
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

    if (showForm === "admin_kecamatan" && formKecamatanIds.length === 0) {
      alert("Minimal pilih 1 kecamatan");
      return;
    }

    setSaving(true);

    try {
      const payload: Record<string, any> = {
        nama: formNama,
        username: formUsername,
        role: showForm,
        kecamatanIds: showForm === "admin_kecamatan" ? formKecamatanIds : [],
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

      setShowForm(null);
      setEditing(null);
      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await modal.confirm({
      title: "Hapus Akun?",
      description: "Akun ini akan dihapus permanen.",
      confirmText: "Hapus",
      cancelText: "Batal",
      confirmButtonVariant: "danger",
    });
    if (!confirmed) return;

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
    <div className="space-y-6">
      {/* ==================== ADMIN SECTION (super_admin only) ==================== */}
      {isSuperAdmin && (
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 sm:h-10 sm:w-10 dark:bg-violet-900/20">
              <Shield size={18} className="text-violet-600 sm:text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                Admin
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                {adminList.length} akun
              </p>
            </div>
          </div>
          <BrandButton
            variant="primary"
            size="sm"
            onClick={() => openForm("admin")}
            icon={<Plus size={16} />}
          >
            <span className="hidden sm:inline">Tambah Admin</span>
            <span className="sm:hidden">Tambah</span>
          </BrandButton>
        </div>

        {adminList.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Belum ada akun admin
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {adminList.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 sm:h-10 sm:w-10 dark:bg-violet-900/20">
                  <Shield size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">
                    {admin.nama}
                  </h3>
                  <p className="truncate text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    @{admin.username}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 sm:px-2.5 sm:text-[11px] dark:bg-violet-900/30 dark:text-violet-400">
                    ADMIN
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs ${
                      admin.is_active
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-slate-400"
                    }`}
                  >
                    {admin.is_active ? "Aktif" : "Nonaktif"}
                  </span>

                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => openForm("admin", admin)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 sm:p-2 dark:text-slate-400 dark:hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(admin.id, admin.is_active)}
                      className="rounded-lg px-2 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-xs dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      <span className="hidden sm:inline">{admin.is_active ? "Nonaktifkan" : "Aktifkan"}</span>
                      <span className="sm:hidden">{admin.is_active ? "Non" : "Aktif"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 sm:p-2 dark:text-red-400 dark:hover:bg-red-950/40"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* ==================== ADMIN KECAMATAN SECTION ==================== */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 sm:h-10 sm:w-10 dark:bg-teal-900/20">
              <Users size={18} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                Akun
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                {kecamatanList.length} akun
              </p>
            </div>
          </div>
          <BrandButton
            variant="secondary"
            size="sm"
            onClick={() => openForm("admin_kecamatan")}
            icon={<Plus size={16} />}
          >
            <span className="hidden sm:inline">Tambah Akun</span>
            <span className="sm:hidden">Tambah</span>
          </BrandButton>
        </div>

        {kecamatanList.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Belum ada akun
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {kecamatanList.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 sm:h-10 sm:w-10 dark:bg-teal-900/20">
                  <Users size={16} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">
                    {admin.nama}
                  </h3>
                  <p className="truncate text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    @{admin.username} ·{" "}
                    {admin.kecamatan.length > 0
                      ? admin.kecamatan.join(", ")
                      : "Belum ada kecamatan"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="rounded-lg bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 sm:px-2.5 sm:text-[11px] dark:bg-teal-900/30 dark:text-teal-400">
                    KECAMATAN
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs ${
                      admin.is_active
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-slate-400"
                    }`}
                  >
                    {admin.is_active ? "Aktif" : "Nonaktif"}
                  </span>

                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => openForm("admin_kecamatan", admin)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 sm:p-2 dark:text-slate-400 dark:hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(admin.id, admin.is_active)}
                      className="rounded-lg px-2 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-xs dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      <span className="hidden sm:inline">{admin.is_active ? "Nonaktifkan" : "Aktifkan"}</span>
                      <span className="sm:hidden">{admin.is_active ? "Non" : "Aktif"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 sm:p-2 dark:text-red-400 dark:hover:bg-red-950/40"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== MODAL FORM ==================== */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {editing
                ? `Edit ${showForm === "admin" ? "Admin" : "Akun"}`
                : `Tambah ${showForm === "admin" ? "Admin" : "Akun"}`}
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

              {showForm === "admin_kecamatan" && (
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
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <BrandButton
                variant="ghost"
                size="md"
                className="flex-1"
                onClick={() => {
                  setShowForm(null);
                  setEditing(null);
                }}
              >
                Batal
              </BrandButton>
              <BrandButton
                variant={showForm === "admin" ? "primary" : "secondary"}
                size="md"
                className="flex-1"
                onClick={handleSave}
                disabled={saving}
                loading={saving}
              >
                {saving ? "Menyimpan..." : editing ? "Update" : "Simpan"}
              </BrandButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
