import { Download, FileSpreadsheet, Plus, Upload } from "lucide-react";

const actions = [
  {
    icon: Plus,
    label: "Tambah",
  },
  {
    icon: Upload,
    label: "Import",
  },
  {
    icon: Download,
    label: "Export",
  },
  {
    icon: FileSpreadsheet,
    label: "Excel",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              className="rounded-2xl border border-slate-100 p-5 transition hover:bg-slate-50"
            >
              <Icon size={24} className="mx-auto mb-3" />

              <p className="text-sm font-medium">{action.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
