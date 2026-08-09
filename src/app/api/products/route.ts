import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type ProductLegalitas = {
  jenis: "halal" | "pirt" | "haki" | "kbli";
  kode?: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const umkmId = searchParams.get("umkm_id");
    const search = searchParams.get("search");
    const available = searchParams.get("available");

    let query = supabase
      .from("products")
      .select(
        `
          id,
          umkm_id,
          nama,
          deskripsi,
          harga,
          satuan,
          gambar,
          is_available,
          created_at,
          updated_at,
          umkm:umkm_id (
            id,
            nama,
            owner_id
          ),
          product_legalitas (
            id,
            jenis,
            kode,
            created_at
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (umkmId) {
      query = query.eq("umkm_id", umkmId);
    }

    if (search?.trim()) {
      query = query.ilike("nama", `%${search.trim()}%`);
    }

    if (available === "true" || available === "false") {
      query = query.eq("is_available", available === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET /api/products error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data produk",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("GET /api/products unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      umkm_id,
      nama,
      deskripsi,
      harga,
      satuan,
      gambar,
      is_available,
      legalitas,
    }: {
      umkm_id?: string;
      nama?: string;
      deskripsi?: string | null;
      harga?: number | string | null;
      satuan?: string | null;
      gambar?: string[];
      is_available?: boolean;
      legalitas?: ProductLegalitas[];
    } = body;

    if (!umkm_id) {
      return NextResponse.json(
        {
          success: false,
          message: "UMKM wajib dipilih",
        },
        { status: 400 },
      );
    }

    if (!nama || typeof nama !== "string" || !nama.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama produk wajib diisi",
        },
        { status: 400 },
      );
    }

    const { data: umkm, error: umkmError } = await supabase
      .from("umkm")
      .select("id, halal, pirt, haki, kbli")
      .eq("id", umkm_id)
      .maybeSingle();

    if (umkmError) {
      console.error("Check UMKM error:", umkmError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa data UMKM",
          error: umkmError.message,
        },
        { status: 500 },
      );
    }

    if (!umkm) {
      return NextResponse.json(
        {
          success: false,
          message: "UMKM tidak ditemukan",
        },
        { status: 404 },
      );
    }

    let normalizedHarga: number | null = null;

    if (harga !== undefined && harga !== null && harga !== "") {
      const parsedHarga = Number(harga);

      if (!Number.isFinite(parsedHarga) || parsedHarga < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Harga produk tidak valid",
          },
          { status: 400 },
        );
      }

      normalizedHarga = parsedHarga;
    }

    const normalizedGambar = Array.isArray(gambar)
      ? gambar.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
      : [];

    const allowedJenis: ProductLegalitas["jenis"][] = [
      "halal",
      "pirt",
      "haki",
      "kbli",
    ];

    const normalizedLegalitas: ProductLegalitas[] = Array.isArray(legalitas)
      ? legalitas
          .filter(
            (item): item is ProductLegalitas =>
              item !== null &&
              typeof item === "object" &&
              allowedJenis.includes(item.jenis),
          )
          .map((item) => ({
            jenis: item.jenis,
            kode:
              item.jenis === "kbli" && item.kode
                ? String(item.kode).trim()
                : null,
          }))
      : [];

    const uniqueLegalitas = Array.from(
      new Map(
        normalizedLegalitas.map((item) => [
          `${item.jenis}:${item.kode ?? ""}`,
          item,
        ]),
      ).values(),
    );

    const umkmHasLegalitas = (
      jenis: ProductLegalitas["jenis"],
      kode?: string | null,
    ) => {
      switch (jenis) {
        case "halal":
          return Boolean(umkm.halal);

        case "pirt":
          return Boolean(umkm.pirt);

        case "haki":
          return Boolean(umkm.haki);

        case "kbli":
          return (
            Boolean(kode) &&
            Array.isArray(umkm.kbli) &&
            umkm.kbli.some(
              (item: string) => String(item).trim() === String(kode).trim(),
            )
          );

        default:
          return false;
      }
    };

    for (const item of uniqueLegalitas) {
      if (!umkmHasLegalitas(item.jenis, item.kode)) {
        return NextResponse.json(
          {
            success: false,
            message:
              item.jenis === "kbli"
                ? `KBLI ${item.kode} tidak terdaftar pada UMKM`
                : `Legalitas ${item.jenis.toUpperCase()} belum terdaftar pada UMKM`,
          },
          { status: 400 },
        );
      }
    }

    const productPayload = {
      umkm_id,
      nama: nama.trim(),
      deskripsi:
        typeof deskripsi === "string" && deskripsi.trim()
          ? deskripsi.trim()
          : null,
      harga: normalizedHarga,
      satuan:
        typeof satuan === "string" && satuan.trim() ? satuan.trim() : null,
      gambar: normalizedGambar,
      is_available: typeof is_available === "boolean" ? is_available : true,
    };

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(productPayload)
      .select(
        `
          id,
          umkm_id,
          nama,
          deskripsi,
          harga,
          satuan,
          gambar,
          is_available,
          created_at,
          updated_at
        `,
      )
      .single();

    if (productError) {
      console.error("Create product error:", productError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal menambahkan produk",
          error: productError.message,
        },
        { status: 500 },
      );
    }

    if (uniqueLegalitas.length > 0) {
      const legalitasPayload = uniqueLegalitas.map((item) => ({
        product_id: product.id,
        jenis: item.jenis,
        kode: item.jenis === "kbli" ? item.kode : null,
      }));

      const { error: legalitasError } = await supabase
        .from("product_legalitas")
        .insert(legalitasPayload);

      if (legalitasError) {
        console.error("Create product legalitas error:", legalitasError);

        await supabase.from("products").delete().eq("id", product.id);

        return NextResponse.json(
          {
            success: false,
            message: "Gagal menyimpan legalitas produk",
            error: legalitasError.message,
          },
          { status: 500 },
        );
      }
    }

    const { data: result, error: resultError } = await supabase
      .from("products")
      .select(
        `
          id,
          umkm_id,
          nama,
          deskripsi,
          harga,
          satuan,
          gambar,
          is_available,
          created_at,
          updated_at,
          product_legalitas (
            id,
            jenis,
            kode,
            created_at
          )
        `,
      )
      .eq("id", product.id)
      .single();

    if (resultError) {
      console.error("Get created product error:", resultError);

      return NextResponse.json({
        success: true,
        message: "Produk berhasil ditambahkan",
        data: product,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/products unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}
