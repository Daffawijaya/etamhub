import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .order("nama", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

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

    const umkms = rows.map((item: any) => ({
      id: crypto.randomUUID(),
      nama: item["Nama UMKM"] ?? "",
      pemilik: item["Pemilik"] ?? "",
      kategori: item["Kategori"] ?? "",
      subkategori: item["Subkategori"] ?? "",
      deskripsi:
        item["Deskripsi usaha"] ??
        item["Deskripsi usaha (umkm apa, produk yang dijual)"] ??
        "",
      gambar: item["Foto usaha/produk"]
        ? String(item["Foto usaha/produk"])
            .split(",")
            .map((v: string) => v.trim())
            .filter(Boolean)
        : [],
      kecamatan: item["Kecamatan"] ?? "",
      alamat: item["Alamat lengkap"] ?? "",
      lat: Number(item["Latitude"]) || null,
      lng: Number(item["Longitude"]) || null,
      whatsapp: item["whatsapp"] ?? item["whatsapp (08xxxxxxxxxx)"] ?? "",
      instagram: item["instagram"] ?? item["instagram id (tanpa @)"] ?? "",
      facebook: item["facebook url"] ?? "",
      tiktok: item["tiktok"] ?? item["tiktok id (tanpa @)"] ?? "",
      created_at: now,
      updated_at: now,
    }));

    const { data, error } = await supabase.from("umkm").insert(umkms).select();

    if (error) {
      throw error;
    }

    await supabase.from("notifications").insert({
      id: crypto.randomUUID(),
      type: "import",
      title: `Berhasil mengimpor ${data.length} UMKM`,
      created_at: now,
      read: false,
    });

    return NextResponse.json({
      success: true,
      imported: data.length,
      data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
