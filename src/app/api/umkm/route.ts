import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return NextResponse.json(data);
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
    const { data: existingNik, error: nikError } = await supabase
      .from("umkm")
      .select("id")
      .eq("nik", body.nik)
      .maybeSingle();

    if (nikError) throw nikError;

    if (existingNik) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar." },
        { status: 409 },
      );
    }

    if (body.nib) {
      const { data: existingNib, error: nibError } = await supabase
        .from("umkm")
        .select("id")
        .eq("nib", body.nib)
        .maybeSingle();

      if (nibError) throw nibError;

      if (existingNib) {
        return NextResponse.json(
          { message: "NIB sudah terdaftar." },
          { status: 409 },
        );
      }
    }
    body.whatsapp = normalizeWhatsapp(body.whatsapp);
    body.instagram = normalizeInstagramUsername(body.instagram);
    body.tiktok = normalizeTiktokUsername(body.tiktok);

    if (!isValidWhatsapp(body.whatsapp)) {
      return NextResponse.json(
        { message: "Nomor WhatsApp tidak valid." },
        { status: 400 },
      );
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { message: "Email tidak valid." },
        { status: 400 },
      );
    }
    if (!isValidFacebookUrl(body.facebook)) {
      return NextResponse.json(
        { message: "URL Facebook tidak valid." },
        { status: 400 },
      );
    }

    if (!isValidInstagramUsername(body.instagram)) {
      return NextResponse.json(
        { message: "Username Instagram tidak valid." },
        { status: 400 },
      );
    }

    if (!isValidTiktokUsername(body.tiktok)) {
      return NextResponse.json(
        { message: "Username TikTok tidak valid." },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("umkm")
      .insert({
        id: crypto.randomUUID(),
        ...body,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("notifications").insert({
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
