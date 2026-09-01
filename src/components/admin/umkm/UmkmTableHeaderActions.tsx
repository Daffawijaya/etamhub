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
import BrandButton from "@/components/ui/BrandButton";

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
            <BrandButton
              key={action.type}
              variant="outline"
              size="sm"
              onClick={() => handleClick(action.type)}
              title={action.label}
              icon={<Icon size={16} />}
            >
              <span className="hidden sm:inline">{action.label}</span>
            </BrandButton>
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
              <BrandButton
                variant="ghost"
                size="md"
                onClick={() => setShowExportModal(false)}
              >
                Batal
              </BrandButton>

              <BrandButton
                variant="primary"
                size="md"
                onClick={handleExport}
                icon={<Download size={16} />}
              >
                Export
              </BrandButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
