"use client";

export default function UmkmLegalityTab() {
  const legalitas = [
    {
      label: "NIB",
      value: "Belum Diisi",
    },
    {
      label: "NPWP",
      value: "Belum Diisi",
    },
    {
      label: "Halal",
      value: "Belum Diisi",
    },
    {
      label: "PIRT",
      value: "Belum Diisi",
    },
    {
      label: "HAKI",
      value: "Belum Diisi",
    },
    {
      label: "KBLI",
      value: "Belum Diisi",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {legalitas.map((item) => (
        <div
          key={item.label}
          className="
            rounded-2xl
            border
            border-white
            bg-light-bg
            p-4
            transition-all
            duration-300
            hover:border-violet-500/20
            hover:bg-violet-500/[0.03]
            dark:border-white/10
            dark:bg-white/[0.03]
          "
        >
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {item.label}
          </p>

          <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
