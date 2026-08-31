"use client";

import { Download, FilePlus2, FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  downloadUmkmTemplate,
  exportUmkmExcel,
  importUmkmExcel,
} from "@/lib/excel";
import { exportFields } from "@/lib/export-fields";

const actions = [
  {
    icon: FilePlus2,
    label: "Tambah UMKM",
    type: "add",
  },
  {
    icon: Upload,
    label: "Import",
    type: "import",
  },
  {
    icon: Download,
    label: "Export",
    type: "export",
  },
  {
    icon: FileSpreadsheet,
    label: "Template",
    type: "template",
  },
];

export default function UmkmTableHeaderActions() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showExportModal, setShowExportModal] = useState(false);

  const [selectedFields, setSelectedFields] = useState<string[]>(
    exportFields.map((field) => field.key),
  );

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const result = await importUmkmExcel(file);

      alert(`Import ${result.imported} UMKM`);
    } catch (error) {
      console.error(error);

      alert("Gagal import data");
    }

    e.target.value = "";
  }

  function toggleField(key: string) {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  async function handleExport() {
    if (selectedFields.length === 0) {
      alert("Pilih minimal satu kolom.");
      return;
    }

    try {
      await exportUmkmExcel(selectedFields);
      setShowExportModal(false);
    } catch (error) {
      console.error(error);
      alert("Gagal export data");
    }
  }

  async function handleClick(type: string) {
    switch (type) {
      case "add":
        router.push("/admin/tambah");
        break;

      case "import":
        fileRef.current?.click();
        break;

      case "export":
        setShowExportModal(true);
        break;

      case "template":
        downloadUmkmTemplate();
        break;
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleImport}
      />

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.type}
              onClick={() => handleClick(action.type)}
              title={action.label}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-dark-card
                px-2.5 py-2 sm:px-3
                text-sm
                font-medium
                text-slate-700
                dark:text-white
                transition-all
                duration-300
                hover:bg-slate-50
                dark:hover:bg-dark
              "
            >
              <Icon
                size={16}
                className="
                  text-slate-600
                  dark:text-slate-300
                "
              />

              <span className="hidden sm:inline">{action.label}</span>
            </button>
          );
        })}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-card">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Export Data UMKM
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pilih kolom yang ingin diexport.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {exportFields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                  />

                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {field.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
              >
                Batal
              </button>

              <button
                onClick={handleExport}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
