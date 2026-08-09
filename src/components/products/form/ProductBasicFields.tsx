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
  return (
    <>
      <div>
        <label
          htmlFor="product-name"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Nama Produk
        </label>

        <input
          id="product-name"
          type="text"
          value={nama}
          onChange={(event) => onNamaChange(event.target.value)}
          placeholder="Masukkan nama produk"
          disabled={disabled}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="product-description"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Deskripsi
        </label>

        <textarea
          id="product-description"
          value={deskripsi}
          onChange={(event) => onDeskripsiChange(event.target.value)}
          placeholder="Masukkan deskripsi produk"
          rows={4}
          disabled={disabled}
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="product-price"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Harga
          </label>

          <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900">
            <span className="flex items-center border-r border-gray-300 px-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
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
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="product-unit"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Satuan
          </label>

          <input
            id="product-unit"
            type="text"
            value={satuan}
            onChange={(event) => onSatuanChange(event.target.value)}
            placeholder="Contoh: pcs, kg, botol, pack"
            disabled={disabled}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => onAvailableChange(event.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />

        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Produk tersedia
        </span>
      </label>
    </>
  );
}
