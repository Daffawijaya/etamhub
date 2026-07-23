"use client";

import { Download, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";

import {
  downloadUmkmTemplate,
  exportUmkmExcel,
  importUmkmExcel,
} from "@/lib/excel";

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
    if (type === "add") {
      router.push("/admin/tambah");
      return;
    }

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
  );
}