"use client";

import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { useRef } from "react";

import {
  downloadUmkmTemplate,
  exportUmkmExcel,
  importUmkmExcel,
} from "@/lib/excel";

const actions = [
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
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const total = await importUmkmExcel(file);

      alert(`${total} UMKM berhasil diimport`);
    } catch (error) {
      console.error(error);

      alert("Gagal import data");
    }

    e.target.value = "";
  }

  async function handleClick(type: string) {

    if (type === "import") {
      fileRef.current?.click();
      return;
    }

    if (type === "export") {
      await exportUmkmExcel();
      return;
    }

    if (type === "template") {
      downloadUmkmTemplate();
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
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <Icon size={16} />
              {action.label}
            </button>
          );
        })}
      </div>
    </>
  );
}