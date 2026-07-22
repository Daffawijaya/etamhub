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
    <div className="rounded-2xl bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              className="rounded-2xl p-5 transition hover:bg-slate-50"
            >
              <Icon
                size={24}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm font-medium text-slate-900">
                {action.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}