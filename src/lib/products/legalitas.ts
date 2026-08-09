import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type ProductLegalitas = {
  jenis: "halal" | "pirt" | "haki" | "kbli";
  kode?: string | null;
};

export const allowedJenis: ProductLegalitas["jenis"][] = [
  "halal",
  "pirt",
  "haki",
  "kbli",
];

export async function validateLegalitas(
  umkmId: string,
  legalitas: ProductLegalitas[],
) {
  const { data: umkm, error } = await supabase
    .from("umkm")
    .select("id, halal, pirt, haki, kbli")
    .eq("id", umkmId)
    .maybeSingle();

  if (error) {
    return {
      valid: false,
      status: 500,
      message: "Gagal memeriksa data UMKM",
      error: error.message,
    };
  }

  if (!umkm) {
    return {
      valid: false,
      status: 404,
      message: "UMKM tidak ditemukan",
    };
  }

  for (const item of legalitas) {
    if (!allowedJenis.includes(item.jenis)) {
      return {
        valid: false,
        status: 400,
        message: `Jenis legalitas ${item.jenis} tidak valid`,
      };
    }

    if (item.jenis === "halal" && !umkm.halal) {
      return {
        valid: false,
        status: 400,
        message: "Legalitas HALAL belum terdaftar pada UMKM",
      };
    }

    if (item.jenis === "pirt" && !umkm.pirt) {
      return {
        valid: false,
        status: 400,
        message: "Legalitas PIRT belum terdaftar pada UMKM",
      };
    }

    if (item.jenis === "haki" && !umkm.haki) {
      return {
        valid: false,
        status: 400,
        message: "Legalitas HAKI belum terdaftar pada UMKM",
      };
    }

    if (item.jenis === "kbli") {
      const kode = item.kode?.trim();

      if (!kode) {
        return {
          valid: false,
          status: 400,
          message: "Kode KBLI wajib diisi",
        };
      }

      const kbli = Array.isArray(umkm.kbli) ? umkm.kbli : [];

      if (!kbli.some((item: string) => item.trim() === kode)) {
        return {
          valid: false,
          status: 400,
          message: `KBLI ${kode} tidak terdaftar pada UMKM`,
        };
      }
    }
  }

  return {
    valid: true,
    status: 200,
    umkm,
  };
}
