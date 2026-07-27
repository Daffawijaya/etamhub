"use client";

import { Download, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { downloadUmkmTemplate, importUmkmExcel } from "@/lib/excel";

import ExportModal from "@/components/modal/ExportModal";

const actions = [
  {
    icon: Plus,
    label: "Tambah",
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

export default function QuickActions() {
  const router = useRouter();

  const fileRef = useRef<HTMLInputElement>(null);

  const [exportOpen, setExportOpen] = useState(false);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const result = await importUmkmExcel(file);

      alert(`${result.imported} UMKM berhasil diimport`);
    } catch (error: any) {
      console.error(error);

      alert(error.message || "Gagal import data");
    }

    e.target.value = "";
  }

  function handleClick(type: string) {
    switch (type) {
      case "add":
        router.push("/admin/tambah");
        break;

      case "import":
        fileRef.current?.click();
        break;

      case "export":
        setExportOpen(true);
        break;

      case "template":
        downloadUmkmTemplate();
        break;
    }
  }

  return (
    <>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />

      <div
        className="
          rounded-2xl
          bg-white
          dark:bg-dark-card
          p-6
          transition-colors
          duration-300
        "
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleImport}
        />

        <h2
          className="
            mb-5
            text-lg
            font-semibold
            text-slate-900
            dark:text-white
            transition-colors
            duration-300
          "
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleClick(action.type)}
                className="
                  rounded-2xl
                  p-5
                  transition
                  duration-300
                  hover:bg-slate-50
                  dark:hover:bg-dark
                "
              >
                <Icon
                  size={24}
                  className="
                    mx-auto
                    mb-3
                    text-slate-700
                    dark:text-slate-200
                    transition-colors
                    duration-300
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-900
                    dark:text-white
                    transition-colors
                    duration-300
                  "
                >
                  {action.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
