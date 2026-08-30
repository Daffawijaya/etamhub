import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import {
  normalizeUmkmBody,
  validateUmkmBody,
  normalizeNullable,
} from "@/lib/validation";

async function checkAdmin() {
  const user = await getCurrentUser();

  if (!user || !["admin", "super_admin"].includes(user.role ?? "")) {
    return false;
  }

  return true;
}

async function checkSuperAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "super_admin") {
    return false;
  }

  return true;
}

const MAX_NOTIFICATION_AGE = 30 * 24 * 60 * 60 * 1000;

function cleanNotifications(notifications: any[]) {
  const now = Date.now();

  return notifications.filter(
    (item) => now - new Date(item.created_at).getTime() <= MAX_NOTIFICATION_AGE,
  );
}

// =========================
// GET UMKM BY ID
// =========================

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const allowed = await checkAdmin();

  if (!allowed) {
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
    const { data: owner } = await supabaseAdmin
      .from("users")
      .select("email, nik")
      .eq("id", data.owner_id)
      .maybeSingle();

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
  const allowed = await checkSuperAdmin();

  if (!allowed) {
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

  if (body.nik) {
    const { data: existingNik, error: nikError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("nik", body.nik)
      .neq("id", oldData.owner_id)
      .maybeSingle();

    if (nikError) throw nikError;

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
  }

  const { data: owner } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", oldData.owner_id)
    .maybeSingle();

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

  if (owner) {
    const { data: existingEmail } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", body.email)
      .neq("id", owner.id)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan.",
        },
        {
          status: 409,
        },
      );
    }

    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({
        email: body.email,
        nik: body.nik,
        updated_at: new Date().toISOString(),
      })
      .eq("id", owner.id);

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
  // =========================
  // DELETE REMOVED IMAGES
  // =========================

  const oldImages = Array.isArray(oldData.gambar) ? oldData.gambar : [];
  const newImages = Array.isArray(body.gambar) ? body.gambar : [];

  // gambar yang sudah tidak dipakai lagi
  const removedImages = oldImages.filter(
    (img: string) => !newImages.includes(img),
  );

  if (removedImages.length > 0) {
    const imagePaths = removedImages
      .map((url: string) => {
        const marker = "/umkm-images/";
        const index = url.indexOf(marker);

        if (index === -1) return null;

        return url.substring(index + marker.length);
      })
      .filter(Boolean);

    if (imagePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("umkm-images")
        .remove(imagePaths as string[]);

      if (storageError) {
        console.error("STORAGE DELETE ERROR:", storageError);
      }
    }
  }

  const now = new Date().toISOString();

  const { email, nik, ...umkmData } = body;

  const updated = {
    ...umkmData,
    id: oldData.id,
    created_at: oldData.created_at,
    updated_at: now,
  };

  const { data, error } = await supabaseAdmin
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

  const { error: notifError } = await supabaseAdmin
    .from("notifications")
    .insert({
      id: crypto.randomUUID(),
      type: "update",
      title: `Update UMKM ${updated.nama}`,
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
  const allowed = await checkSuperAdmin();

  if (!allowed) {
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

  // =========================
  // DELETE IMAGE FROM STORAGE
  // =========================

  if (target.gambar && Array.isArray(target.gambar)) {
    const imagePaths = target.gambar
      .map((url: string) => {
        const path = "/umkm-images/";

        const index = url.indexOf(path);

        if (index === -1) return null;

        return url.substring(index + path.length);
      })
      .filter(Boolean);

    if (imagePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("umkm-images")
        .remove(imagePaths as string[]);

      if (storageError) {
        console.error("STORAGE DELETE ERROR:", storageError);
      }
    }
  }

  // =========================
  // DELETE DATABASE DATA
  // =========================

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

  // =========================
  // CREATE NOTIFICATION
  // =========================

  const now = new Date().toISOString();

  const { error: notifError } = await supabaseAdmin
    .from("notifications")
    .insert({
      id: crypto.randomUUID(),
      type: "delete",
      title: `Hapus UMKM ${target.nama}`,
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
