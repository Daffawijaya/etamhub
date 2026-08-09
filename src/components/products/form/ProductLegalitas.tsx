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

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Legalitas Produk
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Pilih legalitas yang berlaku untuk produk ini.
        </p>
      </div>

      <div className="space-y-3">
        {hasHalal && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <input
              type="checkbox"
              checked={selected.halal}
              onChange={() => onToggle("halal")}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />

            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Halal
            </span>
          </label>
        )}

        {hasPirt && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <input
              type="checkbox"
              checked={selected.pirt}
              onChange={() => onToggle("pirt")}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />

            <span className="text-sm font-medium text-gray-900 dark:text-white">
              PIRT
            </span>
          </label>
        )}

        {hasHaki && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <input
              type="checkbox"
              checked={selected.haki}
              onChange={() => onToggle("haki")}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />

            <span className="text-sm font-medium text-gray-900 dark:text-white">
              HAKI
            </span>
          </label>
        )}

        {availableKbli.length > 0 && (
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              KBLI
            </p>

            <div className="space-y-2">
              {availableKbli.map((kode) => (
                <label
                  key={kode}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selected.kbli.includes(kode)}
                    onChange={() => onToggleKbli(kode)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />

                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {kode}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {!hasLegalitas && (
          <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            UMKM belum memiliki legalitas yang dapat digunakan untuk produk.
          </div>
        )}
      </div>
    </div>
  );
}
