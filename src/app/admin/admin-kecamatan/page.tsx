"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Plus, Trash2, Edit2, Shield, Users, Settings } from "lucide-react";
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
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [perms, setPerms] = useState<Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>>({});
  const [draftPerms, setDraftPerms] = useState<Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>>({});
  const [hasUnsavedPermChanges, setHasUnsavedPermChanges] = useState(false);
  const [savingPerms, setSavingPerms] = useState(false);

  const isSuperAdmin = currentRole === "super_admin";
  const isAdmin = currentRole === "admin";
  const canManageAkun = isSuperAdmin || isAdmin;
  const [activeTab, setActiveTab] = useState<"admin" | "admin_kecamatan">(isAdmin ? "admin_kecamatan" : "admin");
  const adminList = admins.filter((a) => a.role === "admin");
  const kecamatanList = admins.filter((a) => a.role === "admin_kecamatan");
  // Admin hanya bisa lihat tab admin_kecamatan
  const visibleTabs = isSuperAdmin
    ? (["admin", "admin_kecamatan"] as const)
    : (["admin_kecamatan"] as const);
  const currentList = activeTab === "admin" ? adminList : kecamatanList;

  async function loadPerms(role: string | null) {
    if (role !== "super_admin") return;
    try {
      const res = await fetch("/api/admin/role-permissions");
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, any> = {};
        for (const p of data) map[p.role] = p;
        setPerms(map);
        setDraftPerms(map);
        setHasUnsavedPermChanges(false);
      }
    } catch {}
  }

  async function loadData() {
    try {
      const [roleRes, adminsRes, kecRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/admin-kecamatan"),
        fetch("/api/kecamatan"),
      ]);

      const roleData = await roleRes.json();
      const role = roleData.role ?? null;
      setCurrentRole(role);

      const adminsData = await adminsRes.json();
      const kecData = await kecRes.json();

      if (adminsRes.ok && Array.isArray(adminsData)) setAdmins(adminsData);
      setKecamatanOptions(kecData ?? []);
      await loadPerms(role);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handlePermToggle(role: string, key: "canCreate" | "canRead" | "canUpdate" | "canDelete", value: boolean) {
    setDraftPerms((s) => ({
      ...s,
      [role]: { ...s[role], [key]: value },
    }));
    setHasUnsavedPermChanges(true);
  }

  async function handleSavePerms() {
    setSavingPerms(true);
    modal.loading({ title: "Menyimpan hak akses..." });
    try {
      for (const role of ["admin", "admin_kecamatan"] as const) {
        const prev = perms[role];
        const curr = draftPerms[role];
        if (!prev || !curr) continue;
        for (const key of ["canCreate", "canRead", "canUpdate", "canDelete"] as const) {
          if (prev[key] !== curr[key]) {
            const res = await fetch("/api/admin/role-permissions", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role, [key]: curr[key] }),
            });
            if (!res.ok) throw new Error("Gagal simpan");
          }
        }
      }
      setPerms(draftPerms);
      setHasUnsavedPermChanges(false);
      modal.success({ title: "Tersimpan!", description: "Hak akses CRUD berhasil disimpan." });
    } catch {
      setDraftPerms(perms);
      setHasUnsavedPermChanges(false);
      modal.error({ title: "Gagal Menyimpan", description: "Gagal menyimpan hak akses" });
    } finally {
      setSavingPerms(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Set default tab ke admin_kecamatan kalau role admin (setelah role di-load)
  useEffect(() => {
    if (currentRole === "admin") {
      setActiveTab("admin_kecamatan");
    }
  }, [currentRole]);

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

    modal.loading({ title: "Menyimpan..." });

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
      modal.success({ title: "Tersimpan!", description: "Akun berhasil disimpan." });
      loadData();
    } catch (error) {
      modal.error({ title: "Gagal Menyimpan", description: error instanceof Error ? error.message : "Terjadi kesalahan" });
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

  const permRows = [
    { key: "canCreate" as const, label: "Create", desc: "Tambah data" },
    { key: "canUpdate" as const, label: "Update", desc: "Edit data" },
    { key: "canDelete" as const, label: "Delete", desc: "Hapus data" },
  ];
  const permRoles = [
    { key: "admin" as const, label: "Admin", icon: Shield, color: "violet" },
    { key: "admin_kecamatan" as const, label: "Admin Kecamatan", icon: Users, color: "teal" },
  ];

  return (
    <div className="space-y-4">
      {/* ==================== CRUD PERMISSIONS (super_admin only) ==================== */}
      {isSuperAdmin && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2.5 min-w-0 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 sm:h-10 sm:w-10 dark:from-amber-900/20 dark:to-orange-900/20">
                <Settings size={16} className="text-amber-600 sm:text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900 sm:text-lg dark:text-white">Hak Akses CRUD</h2>
                <p className="text-[11px] text-slate-500 sm:text-sm dark:text-slate-400">Atur izin untuk tiap role</p>
              </div>
            </div>
            <BrandButton
              variant="primary"
              size="sm"
              onClick={handleSavePerms}
              disabled={savingPerms || !hasUnsavedPermChanges}
              className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {savingPerms ? "Menyimpan..." : "Simpan"}
            </BrandButton>
          </div>

          {/* Desktop: Matrix Table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-y border-slate-100 dark:border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6 dark:text-slate-500">
                    Role
                  </th>
                  {permRows.map((row) => (
                    <th key={row.key} className="w-[100px] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{row.label}</span>
                        <span className="text-[10px] font-normal normal-case tracking-normal text-slate-400 dark:text-slate-500">{row.desc}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {permRoles.map((roleDef) => {
                  const p = draftPerms[roleDef.key];
                  const saved = perms[roleDef.key];
                  if (!p) return (
                    <tr key={roleDef.key}>
                      <td colSpan={4} className="px-5 py-4 sm:px-6"><div className="h-8 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" /></td>
                    </tr>
                  );
                  const isRowChanged = JSON.stringify(saved) !== JSON.stringify(p);
                  const Icon = roleDef.icon;
                  return (
                    <tr key={roleDef.key} className={`transition-colors ${isRowChanged ? "bg-emerald-50/30 dark:bg-emerald-500/5" : "hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"}`}>
                      <td className="px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${roleDef.color === "violet" ? "bg-violet-50 dark:bg-violet-900/20" : "bg-teal-50 dark:bg-teal-900/20"}`}>
                            <Icon size={16} className={roleDef.color === "violet" ? "text-violet-600 dark:text-violet-400" : "text-teal-600 dark:text-teal-400"} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{roleDef.label}</p>
                            {isRowChanged && <p className="text-[10px] text-amber-600 dark:text-amber-400">Diubah</p>}
                          </div>
                        </div>
                      </td>
                      {permRows.map((row) => (
                        <td key={row.key} className="w-[100px] px-2 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handlePermToggle(roleDef.key, row.key, !p[row.key])}
                            className={`mx-auto relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${p[row.key] ? "bg-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-400" : "bg-slate-200 focus:ring-slate-400 dark:bg-white/10 dark:focus:ring-slate-500"}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${p[row.key] ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Stacked Cards */}
          <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/5">
            {permRoles.map((roleDef) => {
              const p = draftPerms[roleDef.key];
              const saved = perms[roleDef.key];
              if (!p) return (
                <div key={roleDef.key} className="px-5 py-4"><div className="h-8 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" /></div>
              );
              const isRowChanged = JSON.stringify(saved) !== JSON.stringify(p);
              const Icon = roleDef.icon;
              return (
                <div key={roleDef.key} className={`px-5 py-4 transition-colors ${isRowChanged ? "bg-emerald-50/30 dark:bg-emerald-500/5" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${roleDef.color === "violet" ? "bg-violet-50 dark:bg-violet-900/20" : "bg-teal-50 dark:bg-teal-900/20"}`}>
                      <Icon size={14} className={roleDef.color === "violet" ? "text-violet-600 dark:text-violet-400" : "text-teal-600 dark:text-teal-400"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{roleDef.label}</p>
                      {isRowChanged && <p className="text-[10px] text-amber-600 dark:text-amber-400">Diubah</p>}
                    </div>
                  </div>
                  <div className="space-y-2.5 pl-11">
                    {permRows.map((row) => (
                      <div key={row.key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{row.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePermToggle(roleDef.key, row.key, !p[row.key])}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${p[row.key] ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${p[row.key] ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      )}

      {/* ==================== AKUN SECTION (single card with tabs) ==================== */}
      {canManageAkun && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2.5 min-w-0 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-teal-50 sm:h-10 sm:w-10 dark:from-violet-900/20 dark:to-teal-900/20">
                <Users size={16} className="text-violet-600 sm:text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900 sm:text-lg dark:text-white">Akun</h2>
                <p className="text-[11px] text-slate-500 sm:text-sm dark:text-slate-400">{isSuperAdmin ? admins.length : kecamatanList.length} akun terdaftar</p>
              </div>
            </div>
            <BrandButton
              variant="primary"
              size="sm"
              onClick={() => openForm(activeTab)}
              icon={<Plus size={16} />}
              className="shrink-0"
            >
              Tambah
            </BrandButton>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-100 px-4 sm:px-6 dark:border-white/5">
            <div className="flex gap-0.5">
              {([
                { key: "admin" as const, label: "Admin", shortLabel: "Admin", count: adminList.length, icon: Shield, color: "violet" },
                { key: "admin_kecamatan" as const, label: "Admin Kecamatan", shortLabel: "Kecamatan", count: kecamatanList.length, icon: Users, color: "teal" },
              ] as const).filter((tab) => (visibleTabs as readonly string[]).includes(tab.key)).map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
                      isActive
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon size={15} className={isActive ? (tab.color === "violet" ? "text-violet-600 dark:text-violet-400" : "text-teal-600 dark:text-teal-400") : ""} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}>
                      {tab.count}
                    </span>
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900 dark:bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          {currentList.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Belum ada akun
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {currentList.map((admin) => {
                const isAdmin = admin.role === "admin";
                return (
                  <div
                    key={admin.id}
                    className="px-4 py-3 transition-colors hover:bg-slate-50/50 sm:px-6 sm:py-3.5 dark:hover:bg-white/[0.02]"
                  >
                    {/* Desktop */}
                    <div className="hidden items-center gap-3 sm:flex">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isAdmin ? "bg-violet-50 dark:bg-violet-900/20" : "bg-teal-50 dark:bg-teal-900/20"}`}>
                        {isAdmin ? <Shield size={16} className="text-violet-600 dark:text-violet-400" /> : <Users size={16} className="text-teal-600 dark:text-teal-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{admin.nama}</h3>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          @{admin.username}
                          {!isAdmin && admin.kecamatan.length > 0 && <span> · {admin.kecamatan.join(", ")}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isAdmin ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                          {isAdmin ? "ADMIN" : "KECAMATAN"}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${admin.is_active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
                          {admin.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => openForm(admin.role as any, admin)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleToggleActive(admin.id, admin.is_active)} className="rounded-lg px-2 py-1 text-[10px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
                            {admin.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button onClick={() => handleDelete(admin.id)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Mobile */}
                    <div className="sm:hidden">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isAdmin ? "bg-violet-50 dark:bg-violet-900/20" : "bg-teal-50 dark:bg-teal-900/20"}`}>
                          {isAdmin ? <Shield size={16} className="text-violet-600 dark:text-violet-400" /> : <Users size={16} className="text-teal-600 dark:text-teal-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{admin.nama}</h3>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">@{admin.username}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openForm(admin.role as any, admin)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300" title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(admin.id)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400" title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 pl-12">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isAdmin ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                          {isAdmin ? "ADMIN" : "KECAMATAN"}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${admin.is_active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
                          {admin.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                        {!isAdmin && admin.kecamatan.length > 0 && (
                          <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">· {admin.kecamatan.join(", ")}</span>
                        )}
                        <button onClick={() => handleToggleActive(admin.id, admin.is_active)} className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
                          {admin.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
              >
                {editing ? "Update" : "Simpan"}
              </BrandButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
