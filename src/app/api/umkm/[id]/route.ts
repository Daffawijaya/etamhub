import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import {
  normalizeUmkmBody,
  validateUmkmBody,
  normalizeNullable,
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
  normalizeUmkmBody(body);

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
  const validationError = validateUmkmBody(body);
  if (validationError) {
    return NextResponse.json(
      { message: validationError.message },
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

  const { data: updatedData, error: updateError } = await supabaseAdmin
    .from("umkm")
    .update({
      ...umkmData,
      updated_at: now,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      {
        message: updateError.message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    success: true,
    message: "UMKM berhasil diperbarui",
    data: updatedData,
  });
}

// =========================
// DELETE UMKM
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const { error } = await supabaseAdmin.from("umkm").delete().eq("id", id);

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

  return NextResponse.json({
    success: true,
    message: "UMKM berhasil dihapus",
  });
}
