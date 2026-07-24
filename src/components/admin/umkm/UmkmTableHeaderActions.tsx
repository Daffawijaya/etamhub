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
      const result = await importUmkmExcel(file);

      alert(`Import ${result.imported} UMKM`);
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
                dark:border-slate-800

                bg-white
                dark:bg-dark-card

                px-3
                py-2

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
                  transition-colors
                  duration-300
                "
              />

              {action.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
