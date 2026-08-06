"use client";

type Props = {
  data: {
    nib?: string | null;
    npwp?: string | null;
    halal?: string | null;
    pirt?: string | null;
    haki?: string | null;
    kbli?: string[] | null;
  };
};

export default function UmkmLegalityTab({ data }: Props) {
  const legalitas = [
    {
      label: "NPWP",
      value: data.npwp,
      isArray: false,
    },
    {
      label: "NIB",
      value: data.nib,
      isArray: false,
    },
    {
      label: "PIRT",
      value: data.pirt,
      isArray: false,
    },
    {
      label: "Halal",
      value: data.halal,
      isArray: false,
    },
    {
      label: "HAKI",
      value: data.haki,
      isArray: false,
    },
    {
      label: "KBLI",
      value: data.kbli?.filter(Boolean) ?? [],
      isArray: true,
    },
  ].filter((item) =>
    item.isArray
      ? (item.value as string[]).length > 0
      : item.value !== null &&
        item.value !== undefined &&
        String(item.value).trim() !== "",
  );

  if (legalitas.length === 0) {
    return (
      <div
        className="
          flex
          h-[34.5vh]
          items-center
          justify-center
          rounded-2xl
          bg-light-bg
          text-center
          dark:bg-white/[0.03]
        "
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          UMKM ini belum memiliki legalitas.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[34.5vh] overflow-y-auto pr-2">
      <ul className="">
        {legalitas.map((item) => (
          <li key={item.label} className="py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {item.label}
            </p>

            {item.isArray ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {(item.value as string[]).map((value) => (
                  <span
                    key={value}
                    className="
                      rounded-full
                      bg-violet-500/10
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-violet-600
                      dark:text-violet-300
                    "
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 break-words text-sm font-semibold text-zinc-900 dark:text-white">
                {item.value as string}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
