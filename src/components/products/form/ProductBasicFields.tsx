"use client";

type Props = {
  nama: string;
  deskripsi: string;
  harga: string;
  satuan: string;
  isAvailable: boolean;
  disabled?: boolean;
  onNamaChange: (value: string) => void;
  onDeskripsiChange: (value: string) => void;
  onHargaChange: (value: string) => void;
  onSatuanChange: (value: string) => void;
  onAvailableChange: (value: boolean) => void;
};

export default function ProductBasicFields({
  nama,
  deskripsi,
  harga,
  satuan,
  isAvailable,
  disabled = false,
  onNamaChange,
  onDeskripsiChange,
  onHargaChange,
  onSatuanChange,
  onAvailableChange,
}: Props) {
  const inputClassName =
    "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500 dark:focus:bg-zinc-900";

  const labelClassName =
    "mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200";

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="product-name" className={labelClassName}>
          Nama Produk
        </label>

        <input
          id="product-name"
          type="text"
          value={nama}
          onChange={(event) => onNamaChange(event.target.value)}
          placeholder="Masukkan nama produk"
          disabled={disabled}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="product-description" className={labelClassName}>
          Deskripsi
        </label>

        <textarea
          id="product-description"
          value={deskripsi}
          onChange={(event) => onDeskripsiChange(event.target.value)}
          placeholder="Masukkan deskripsi produk"
          rows={3}
          disabled={disabled}
          className={`${inputClassName} resize-none leading-6`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-price" className={labelClassName}>
            Harga
          </label>

          <div className="flex overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-emerald-500 dark:focus-within:bg-zinc-900">
            <span className="flex items-center border-r border-zinc-200 px-4 text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Rp
            </span>

            <input
              id="product-price"
              type="text"
              inputMode="numeric"
              value={harga}
              onChange={(event) =>
                onHargaChange(
                  event.target.value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                )
              }
              placeholder="0"
              disabled={disabled}
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="product-unit" className={labelClassName}>
            Satuan
          </label>

          <input
            id="product-unit"
            type="text"
            value={satuan}
            onChange={(event) => onSatuanChange(event.target.value)}
            placeholder="Contoh: pcs, kg, botol, pack"
            disabled={disabled}
            className={inputClassName}
          />
        </div>
      </div>

      <label
        className={`flex w-fit items-center gap-3 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => onAvailableChange(event.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Produk tersedia
        </span>
      </label>
    </div>
  );
}
