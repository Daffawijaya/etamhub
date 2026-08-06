"use client";

type Props = {
  activeTab: "deskripsi" | "legalitas";
  onChange: (tab: "deskripsi" | "legalitas") => void;
};

export default function UmkmTabs({ activeTab, onChange }: Props) {
  return (
    <div
      className="
        border-b
        border-zinc-200
        dark:border-white/10
      "
    >
      <div className="flex gap-8">
        <button
          type="button"
          onClick={() => onChange("deskripsi")}
          className={`
            relative
            -mb-px
            border-b-2
            px-1
            py-2
            text-sm
            font-semibold
            transition-colors
            duration-200
            ${
              activeTab === "deskripsi"
                ? `
                  border-violet-500
                  text-violet-600
                  dark:text-violet-400
                `
                : `
                  border-transparent
                  text-zinc-500
                  hover:text-zinc-900
                  dark:text-zinc-400
                  dark:hover:text-white
                `
            }
          `}
        >
          Deskripsi
        </button>

        <button
          type="button"
          onClick={() => onChange("legalitas")}
          className={`
            relative
            -mb-px
            border-b-2
            px-1
            py-2
            text-sm
            font-semibold
            transition-colors
            duration-200
            ${
              activeTab === "legalitas"
                ? `
                  border-violet-500
                  text-violet-600
                  dark:text-violet-400
                `
                : `
                  border-transparent
                  text-zinc-500
                  hover:text-zinc-900
                  dark:text-zinc-400
                  dark:hover:text-white
                `
            }
          `}
        >
          Legalitas
        </button>
      </div>
    </div>
  );
}
