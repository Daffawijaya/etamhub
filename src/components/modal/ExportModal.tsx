"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { exportGroups } from "@/lib/export-fields";
import { exportUmkmExcel } from "@/lib/excel";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExportModal({ open, onClose }: ExportModalProps) {
  const allFields = useMemo(
    () =>
      exportGroups.flatMap((group) => group.fields.map((field) => field.key)),
    [],
  );

  const [selected, setSelected] = useState<string[]>(allFields);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(allFields);
    }
  }, [open, allFields]);

  if (!open) return null;

  function toggleField(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  function toggleGroup(keys: string[]) {
    const checked = keys.every((key) => selected.includes(key));

    if (checked) {
      setSelected((prev) => prev.filter((item) => !keys.includes(item)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...keys])]);
    }
  }

  async function handleExport() {
    try {
      setLoading(true);

      await exportUmkmExcel(selected);

      onClose();
    } catch (error: any) {
      alert(error.message || "Gagal export.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-sm p-5">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-dark-card">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Export Data UMKM
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pilih data yang ingin dimasukkan ke file Excel.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-slate-100 dark:hover:bg-dark"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-5 overflow-y-auto px-8 py-2">
          {exportGroups.map((group) => {
            const keys = group.fields.map((field) => field.key);

            const checked = keys.every((key) => selected.includes(key));

            return (
              <div
                key={group.title}
                className="rounded-2xl bg-slate-50 p-6 transition dark:bg-dark"
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleGroup(keys)}
                    className="h-5 w-5 accent-primary"
                  />

                  <span className="text-base font-semibold text-slate-900 dark:text-white">
                    {group.title}
                  </span>
                </label>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <label
                      key={field.key}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white dark:hover:bg-dark-card"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(field.key)}
                        onChange={() => toggleField(field.key)}
                        className="h-4 w-4 accent-primary"
                      />

                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {field.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
          <div className="flex gap-3">
            <button
              onClick={() => setSelected(allFields)}
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-dark dark:text-slate-300 dark:hover:bg-dark-hover"
            >
              Pilih Semua
            </button>

            <button
              onClick={() => setSelected([])}
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-dark dark:text-slate-300 dark:hover:bg-dark-hover"
            >
              Kosongkan
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-dark dark:text-slate-300 dark:hover:bg-dark-hover"
            >
              Batal
            </button>

            <button
              disabled={loading || selected.length === 0}
              onClick={handleExport}
              className="rounded-xl bg-primary px-6 py-2.5 font-medium text-white shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Mengexport..." : "Export Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
