"use client";

import type { ProductLegalitasJenis } from "@/types/product";

type UmkmLegalitas = {
  halal?: string | null;
  pirt?: string | null;
  haki?: string | null;
  kbli?: string[] | null;
};

export type SelectedLegalitas = {
  halal: boolean;
  pirt: boolean;
  haki: boolean;
  kbli: string[];
};

type Props = {
  legalitas: UmkmLegalitas;
  selected: SelectedLegalitas;
  disabled?: boolean;
  onToggle: (jenis: ProductLegalitasJenis) => void;
  onToggleKbli: (kode: string) => void;
};

const normalizeKbli = (kbli?: string[] | null) =>
  Array.isArray(kbli)
    ? kbli.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

export default function ProductLegalitas({
  legalitas,
  selected,
  disabled = false,
  onToggle,
  onToggleKbli,
}: Props) {
  const availableKbli = normalizeKbli(legalitas.kbli);

  const hasHalal = Boolean(legalitas.halal);
  const hasPirt = Boolean(legalitas.pirt);
  const hasHaki = Boolean(legalitas.haki);

  const hasLegalitas =
    hasHalal || hasPirt || hasHaki || availableKbli.length > 0;

  const itemClassName = (checked: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
      checked
        ? "bg-emerald-50 dark:bg-emerald-950/30"
        : "bg-white dark:bg-[#242424]"
    } ${
      disabled
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#292929]"
    }`;

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Legalitas Produk
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
          Pilih legalitas yang berlaku untuk produk ini. Setiap jenis legalitas
          berdiri sendiri dan dapat dipilih bersamaan.
        </p>
      </div>

      {hasLegalitas ? (
        <div className="mt-4 space-y-3">
          {(hasHalal || hasPirt || hasHaki) && (
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-[#202020]">
              <p className="mb-2 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                Sertifikasi / Legalitas
              </p>

              <div className="grid gap-2 sm:grid-cols-3">
                {hasHalal && (
                  <label className={itemClassName(selected.halal)}>
                    <input
                      type="checkbox"
                      checked={selected.halal}
                      onChange={() => onToggle("halal")}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-[#202020]"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        Halal
                      </p>

                      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-500">
                        {legalitas.halal}
                      </p>
                    </div>
                  </label>
                )}

                {hasPirt && (
                  <label className={itemClassName(selected.pirt)}>
                    <input
                      type="checkbox"
                      checked={selected.pirt}
                      onChange={() => onToggle("pirt")}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-[#202020]"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        PIRT
                      </p>

                      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-500">
                        {legalitas.pirt}
                      </p>
                    </div>
                  </label>
                )}

                {hasHaki && (
                  <label className={itemClassName(selected.haki)}>
                    <input
                      type="checkbox"
                      checked={selected.haki}
                      onChange={() => onToggle("haki")}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-[#202020]"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        HAKI
                      </p>

                      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-500">
                        {legalitas.haki}
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}

          {availableKbli.length > 0 && (
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-[#202020]">
              <div className="mb-2 px-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                  KBLI
                </p>

                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-600">
                  Pilih satu KBLI yang paling sesuai dengan produk.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {availableKbli.map((kode) => {
                  const checked = selected.kbli.includes(kode);

                  return (
                    <label key={kode} className={itemClassName(checked)}>
                      <input
                        type="radio"
                        name="product-legalitas-kbli"
                        checked={checked}
                        onChange={() => onToggleKbli(kode)}
                        disabled={disabled}
                        className="h-4 w-4 border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-[#202020]"
                      />

                      <span className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                        {kode}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-500 dark:bg-[#202020] dark:text-zinc-500">
          UMKM belum memiliki legalitas yang dapat digunakan untuk produk.
        </div>
      )}
    </div>
  );
}
