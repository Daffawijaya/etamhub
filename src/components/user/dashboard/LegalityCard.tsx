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

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
      <h2 className="text-lg font-semibold text-dark dark:text-light">
        Legalitas Usaha
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-dark dark:text-light">
                {item.label}
              </p>

              {item.status ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <XCircle size={18} className="text-red-500" />
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              {item.status ? "Sudah Diisi" : "Belum Diisi"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
