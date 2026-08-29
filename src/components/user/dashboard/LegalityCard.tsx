"use client";

import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  legalitas: {
    nib: boolean;
    npwp: boolean;
    halal: boolean;
    pirt: boolean;
    haki: boolean;
    kbli: boolean;
  };
};

export default function LegalityCard({ legalitas }: Props) {
  const items = [
    {
      label: "NPWP",
      status: legalitas.npwp,
    },
    {
      label: "NIB",
      status: legalitas.nib,
    },
    {
      label: "KBLI",
      status: legalitas.kbli,
    },
    {
      label: "Halal",
      status: legalitas.halal,
    },
    {
      label: "PIRT",
      status: legalitas.pirt,
    },
    {
      label: "HAKI",
      status: legalitas.haki,
    },
  ];

  const count = items.filter((i) => i.status).length;

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Legalitas Usaha
        </h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400">
          {count}/{items.length} terisi
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-100 p-4 dark:border-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {item.label}
              </p>

              {item.status ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>

            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              {item.status ? "Sudah Diisi" : "Belum Diisi"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
