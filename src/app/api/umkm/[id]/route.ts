import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
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

// =========================
// GET UMKM BY ID
// =========================

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  if (data.owner_id) {
    const { data: owner, error: ownerError } = await supabaseAdmin
      .from("users")
      .select("email, nik")
      .eq("id", data.owner_id)
      .maybeSingle();

    console.log({
      ownerId: data.owner_id,
      owner,
      ownerError,
    });

    if (owner) {
      data.email = owner.email;
      data.nik = owner.nik;
    }
  }

  return NextResponse.json(data);
}

// =========================
// UPDATE UMKM
// =========================

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

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

  const { data: oldData, error: findError } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !oldData) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  if (oldData.owner_id !== currentUser.id) {
    return NextResponse.json(
      {
        message: "Tidak memiliki akses",
      },
      {
        status: 403,
      },
    );
  }

  if (body.nib) {
    const { data: existingNib, error: nibError } = await supabaseAdmin
      .from("umkm")
      .select("id")
      .eq("nib", body.nib)
      .neq("id", id)
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

  // =========================
  // DELETE REMOVED IMAGES
  // =========================
  const now = new Date().toISOString();
  // gambar yang sudah tidak dipakai lagi
  const { email, nik, ...umkmData } = body;

  if (email || nik) {
    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({
        email,
        nik,
        updated_at: now,
      })
      .eq("id", currentUser.id);

    if (userError) {
      return NextResponse.json(
        {
          message: userError.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  const updated = {
    ...umkmData,
    id: oldData.id,
    created_at: oldData.created_at,
    updated_at: now,
  };

  const { error: requestError } = await supabaseAdmin
    .from("umkm_requests")
    .insert({
      id: crypto.randomUUID(),
      umkm_id: id,
      action: "update",
      payload: updated,
      user_id: currentUser.id,
      status: "pending",
      created_at: now,
      updated_at: now,
    });

  if (requestError) {
    return NextResponse.json(
      {
        message: requestError.message,
      },
      {
        status: 500,
      },
    );
  }

  await supabaseAdmin.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "request",
    title: `Permintaan update UMKM ${updated.nama}`,
    created_at: now,
    read: false,
  });

  return NextResponse.json({
    success: true,
    message: "Perubahan menunggu persetujuan admin",
  });
}

// =========================
// DELETE UMKM
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const { data: target, error: findError } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !target) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  if (target.owner_id !== currentUser.id) {
    return NextResponse.json(
      {
        message: "Tidak memiliki akses",
      },
      {
        status: 403,
      },
    );
  }

  const now = new Date().toISOString();

  const { error } = await supabaseAdmin.from("umkm_requests").insert({
    id: crypto.randomUUID(),
    umkm_id: id,
    action: "delete",
    payload: target,
    user_id: currentUser.id,
    status: "pending",
    created_at: now,
    updated_at: now,
  });

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }

  await supabaseAdmin.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "request",
    title: `Permintaan hapus UMKM ${target.nama}`,
    created_at: now,
    read: false,
  });

  return NextResponse.json({
    success: true,
    message: "Permintaan hapus menunggu persetujuan admin",
  });
}
