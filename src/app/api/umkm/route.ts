import crypto from "crypto";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  isValidEmail,
  isValidFacebookUrl,
  isValidInstagramUsername,
  isValidTiktokUsername,
  isValidWhatsapp,
  normalizeInstagramUsername,
  normalizeNullable,
  normalizeTiktokUsername,
  normalizeWhatsapp,
} from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    console.log("CURRENT USER:", user);

    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("mode");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");

    const allowedSort = ["nama", "created_at"];
    const sortParam = searchParams.get("sort");

    const sort = allowedSort.includes(sortParam ?? "")
      ? sortParam!
      : "created_at";

    const order = searchParams.get("order") === "asc";

    const page = Number(searchParams.get("page") || 1);
    const requestedLimit = Number(searchParams.get("limit") || 10);
    const limit = Math.min(requestedLimit, 1000);

    let umkmQuery = supabaseAdmin.from("umkm").select("*", { count: "exact" });

    // Public
    if (!user) {
      umkmQuery = umkmQuery.eq("published", true);
    }

    // Super Admin bisa lihat semua saat mode admin
    if (user?.role === "superadmin" && mode === "admin") {
      // no filter
    }

    // User hanya melihat UMKM miliknya
    if (user?.role === "user") {
      umkmQuery = umkmQuery.eq("owner_id", user.id);
    }

    if (kecamatan) {
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", kecamatan)
        .maybeSingle();

      if (kecamatanData) {
        umkmQuery = umkmQuery.eq("kecamatan_id", kecamatanData.id);
      }
    }

    if (kategori) {
      umkmQuery = umkmQuery.eq("kategori", kategori);
    }

    if (status === "public") {
      umkmQuery = umkmQuery.eq("published", true);
    }

    if (status === "private") {
      umkmQuery = umkmQuery.eq("published", false);
    }

    if (search) {
      umkmQuery = umkmQuery.ilike("nama", `%${search}%`);
    }

    umkmQuery = umkmQuery.order(sort, {
      ascending: order,
    });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    umkmQuery = umkmQuery.range(from, to);

    const { data: filtersData } = await supabaseAdmin
      .from("umkm")
      .select("kecamatan, kategori");

    const kecamatanOptions = [
      ...new Set(filtersData?.map((item) => item.kecamatan).filter(Boolean)),
    ];

    const kategoriOptions = [
      ...new Set(filtersData?.map((item) => item.kategori).filter(Boolean)),
    ];

    const { data, error, count } = await umkmQuery;

    if (error) throw error;

    return NextResponse.json({
      data,
      total: count,
      page,
      limit,
      filters: {
        kecamatan: kecamatanOptions,
        kategori: kategoriOptions,
      },
    });
  } catch (error: any) {
    console.error("GET UMKM ERROR:", error);

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
    const user = await getCurrentUser();

    const body = await req.json();

    body.kbli = Array.isArray(body.kbli)
      ? body.kbli.map((item: string) => item.trim()).filter(Boolean)
      : body.kbli
        ? [body.kbli.trim()]
        : [];

    [
      "nib",
      "pirt",
      "halal",
      "haki",
      "email",
      "facebook",
      "instagram",
      "tiktok",
    ].forEach((field) => {
      body[field] = normalizeNullable(body[field]);
    });

    const { data: existingNik } = await supabaseAdmin
      .from("umkm")
      .select("id")
      .eq("nik", body.nik)
      .maybeSingle();

    if (existingNik) {
      return NextResponse.json(
        {
          message: "NIK sudah terdaftar.",
        },
        {
          status: 409,
        },
      );
    }

    if (body.nib) {
      const { data: existingNib } = await supabaseAdmin
        .from("umkm")
        .select("id")
        .eq("nib", body.nib)
        .maybeSingle();

      if (existingNib) {
        return NextResponse.json(
          {
            message: "NIB sudah terdaftar.",
          },
          {
            status: 409,
          },
        );
      }
    }

    body.whatsapp = normalizeWhatsapp(body.whatsapp);
    body.instagram = normalizeInstagramUsername(body.instagram);
    body.tiktok = normalizeTiktokUsername(body.tiktok);

    if (!isValidWhatsapp(body.whatsapp)) {
      return NextResponse.json(
        {
          message: "Nomor WhatsApp tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        {
          message: "Email tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidFacebookUrl(body.facebook)) {
      return NextResponse.json(
        {
          message: "URL Facebook tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidInstagramUsername(body.instagram)) {
      return NextResponse.json(
        {
          message: "Username Instagram tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidTiktokUsername(body.tiktok)) {
      return NextResponse.json(
        {
          message: "Username TikTok tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (body.kecamatan) {
      const { data: kecamatanData, error } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", body.kecamatan)
        .maybeSingle();

      if (error || !kecamatanData) {
        return NextResponse.json(
          {
            message: "Kecamatan tidak ditemukan",
          },
          {
            status: 400,
          },
        );
      }

      body.kecamatan_id = kecamatanData.id;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("umkm")
      .insert({
        id: crypto.randomUUID(),
        ...body,
        owner_id: user?.id ?? null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin.from("notifications").insert({
      id: crypto.randomUUID(),
      type: "create",
      title: `Menambahkan UMKM ${data.nama}`,
      created_at: now,
      read: false,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("POST UMKM ERROR:", error);

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
