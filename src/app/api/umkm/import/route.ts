import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const rows = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        {
          message: "Data import kosong.",
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date().toISOString();

    const umkms = rows.map((item: Record<string, any>) => {
      const lat = Number(item["Latitude"]);
      const lng = Number(item["Longitude"]);

      return {
        id: crypto.randomUUID(),
        nama: String(item["Nama UMKM"] ?? "").trim(),
        pemilik: String(item["Pemilik"] ?? "").trim(),
        kategori: String(item["Kategori"] ?? "").trim(),
        subkategori: String(item["Subkategori"] ?? "").trim(),
        deskripsi: String(
          item["Deskripsi usaha"] ??
            item["Deskripsi usaha (umkm apa, produk yang dijual)"] ??
            "",
        ).trim(),
        gambar: item["Foto usaha/produk"]
          ? String(item["Foto usaha/produk"])
              .split(",")
              .map((v: string) => v.trim())
              .filter(Boolean)
          : [],
        kecamatan: String(item["Kecamatan"] ?? "").trim(),
        alamat: String(item["Alamat lengkap"] ?? "").trim(),
        lat: Number.isFinite(lat) ? lat : null,
        lng: Number.isFinite(lng) ? lng : null,
        whatsapp: String(
          item["whatsapp"] ?? item["whatsapp (08xxxxxxxxxx)"] ?? "",
        ).trim(),
        instagram: String(
          item["instagram"] ?? item["instagram id (tanpa @)"] ?? "",
        ).trim(),
        facebook: String(item["facebook url"] ?? "").trim(),
        tiktok: String(
          item["tiktok"] ?? item["tiktok id (tanpa @)"] ?? "",
        ).trim(),
        created_at: now,
        updated_at: now,
      };
    });

    const { data, error } = await supabase.from("umkm").insert(umkms).select();

    if (error) {
      throw error;
    }

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        id: crypto.randomUUID(),
        type: "import",
        title: `Import ${data.length} UMKM`,
        created_at: now,
        read: false,
      });

    if (notificationError) {
      console.error("Notification Error:", notificationError);
    }

    return NextResponse.json({
      success: true,
      imported: data.length,
    });
  } catch (error: any) {
    console.error("Import Error:", error);

    return NextResponse.json(
      {
        message: error.message || "Terjadi kesalahan saat import UMKM.",
      },
      {
        status: 500,
      },
    );
  }
}
