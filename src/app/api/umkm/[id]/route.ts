import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// =========================
// GET UMKM BY ID
// =========================

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const { data, error } = await supabase
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

  // ambil data lama
  const { data: oldData, error: findError } = await supabase
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

  const now = new Date().toISOString();

  const updated = {
    ...body,
    id: oldData.id,
    created_at: oldData.created_at,
    updated_at: now,
  };

  // update database
  const { data, error } = await supabase
    .from("umkm")
    .update(updated)
    .eq("id", id)
    .select()
    .single();

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

  // buat notification update
  const { error: notifError } = await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "update",
    title: `Update UMKM ${updated.nama}`,
    old_data: oldData,
    new_data: data,
    created_at: now,
    read: false,
  });

  if (notifError) {
    console.error("NOTIFICATION UPDATE ERROR:", notifError);
  }

  return NextResponse.json({
    success: true,
    data,
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

  const { data: target, error: findError } = await supabase
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

  // =========================
  // HAPUS GAMBAR STORAGE
  // =========================

  if (target.gambar && Array.isArray(target.gambar)) {
    const imagePaths = target.gambar
      .map((url: string) => {
        const marker = "/umkm-images/";

        const index = url.indexOf(marker);

        if (index === -1) {
          return null;
        }

        return url.substring(index + marker.length);
      })
      .filter(Boolean);

    if (imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("umkm-images")
        .remove(imagePaths as string[]);

      if (storageError) {
        console.error("STORAGE DELETE ERROR:", storageError);
      }
    }
  }

  // =========================
  // HAPUS DATA UMKM
  // =========================

  const { error } = await supabase.from("umkm").delete().eq("id", id);

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

  const now = new Date().toISOString();

  // =========================
  // NOTIFICATION DELETE
  // =========================

  const { error: notifError } = await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "delete",
    title: `Hapus UMKM ${target.nama}`,
    old_data: target,
    new_data: null,
    created_at: now,
    read: false,
  });

  if (notifError) {
    console.error("NOTIFICATION DELETE ERROR:", notifError);
  }

  return NextResponse.json({
    success: true,
  });
}
