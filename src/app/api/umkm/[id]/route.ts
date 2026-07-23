import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_NOTIFICATION_AGE = 30 * 24 * 60 * 60 * 1000;

function cleanNotifications(notifications: any[]) {
  const now = Date.now();

  return notifications.filter(
    (item) => now - new Date(item.createdAt).getTime() <= MAX_NOTIFICATION_AGE,
  );
}

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
    createdAt: oldData.createdAt,
    updatedAt: now,
  };

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

  await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "update",
    title: `Update UMKM ${updated.nama}`,
    createdAt: now,
    read: false,
  });

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

  await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "delete",
    title: `Hapus UMKM ${target.nama}`,
    createdAt: now,
    read: false,
  });

  return NextResponse.json({
    success: true,
  });
}
