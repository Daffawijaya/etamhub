"use client";

import { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    setShowCurrent(false);
    setShowNew(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    setError("");

    if (!currentPassword || !newPassword) {
      setError("Semua field wajib diisi");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Password baru harus berbeda dari password lama");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccess(true);
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-900/20">
              <Lock size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Pengaturan Akun
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ubah password akun Anda
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {success ? (
          <div className="mt-8 flex flex-col items-center gap-3 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
              <Lock size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Password berhasil diubah!
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-dark dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru (min. 8 karakter)"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-dark dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-dark dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {!success && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
