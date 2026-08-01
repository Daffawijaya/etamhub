import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
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

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");

    let query = supabaseAdmin
      .from("umkm")
      .select("*", { count: "exact" })
      .order("created_at", {
        ascending: false,
      });

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (kecamatan) {
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", kecamatan)
        .maybeSingle();

      if (kecamatanData) {
        query = query.eq("kecamatan_id", kecamatanData.id);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data,
      total: count,
    });
  } catch (error: any) {
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

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

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
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", body.kecamatan)
        .maybeSingle();

      if (!kecamatanData) {
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

    const { email, nik, ...umkmData } = body;

    const { data, error } = await supabaseAdmin
      .from("umkm")
      .insert({
        id: crypto.randomUUID(),
        ...umkmData,
        owner_id: body.owner_id ?? user.id,
        approval_status: "approved",
        approved_by: user.id,
        approved_at: now,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (body.owner_id) {
      await supabaseAdmin
        .from("users")
        .update({
          email,
          nik,
          updated_at: now,
        })
        .eq("id", body.owner_id);
    }

    await supabaseAdmin.from("notifications").insert({
      id: crypto.randomUUID(),
      type: "create",
      title: `Admin menambahkan UMKM ${data.nama}`,
      created_at: now,
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("ADMIN POST UMKM ERROR:", error);

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
