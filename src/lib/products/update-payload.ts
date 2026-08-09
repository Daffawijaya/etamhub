export type ProductUpdateInput = {
  umkm_id?: string;
  nama?: string;
  deskripsi?: string | null;
  harga?: number | string | null;
  satuan?: string | null;
  gambar?: string[];
  is_available?: boolean;
};

export function buildProductUpdatePayload(
  input: ProductUpdateInput,
): Record<string, unknown> {
  const { umkm_id, nama, deskripsi, harga, satuan, gambar, is_available } =
    input;

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (nama !== undefined) {
    if (typeof nama !== "string" || !nama.trim()) {
      throw new Error("Nama produk wajib diisi");
    }

    updatePayload.nama = nama.trim();
  }

  if (deskripsi !== undefined) {
    updatePayload.deskripsi =
      typeof deskripsi === "string" && deskripsi.trim()
        ? deskripsi.trim()
        : null;
  }

  if (harga !== undefined) {
    if (harga === null || harga === "") {
      updatePayload.harga = null;
    } else {
      const parsedHarga = Number(harga);

      if (!Number.isFinite(parsedHarga) || parsedHarga < 0) {
        throw new Error("Harga produk tidak valid");
      }

      updatePayload.harga = parsedHarga;
    }
  }

  if (satuan !== undefined) {
    updatePayload.satuan =
      typeof satuan === "string" && satuan.trim() ? satuan.trim() : null;
  }

  if (gambar !== undefined) {
    if (!Array.isArray(gambar)) {
      throw new Error("Format gambar tidak valid");
    }

    updatePayload.gambar = gambar.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  if (is_available !== undefined) {
    if (typeof is_available !== "boolean") {
      throw new Error("Status ketersediaan produk tidak valid");
    }

    updatePayload.is_available = is_available;
  }

  if (umkm_id !== undefined) {
    updatePayload.umkm_id = umkm_id;
  }

  return updatePayload;
}
