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

/**
 * Merge latest monitoring data into UMKM record.
 * Only fills fields that are null/empty in the UMKM record.
 */
function mergeMonitoringIntoUmkm(umkm: Record<string, any>, latest: Record<string, any>) {
  const merged = { ...umkm };

  const syncFields = [
    "jumlah_tenaga_kerja",
    "omzet",
    "nib",
    "halal",
    "pirt",
    "haki",
    "kbli",
    "instagram",
    "facebook",
    "tiktok",
  ];

  for (const field of syncFields) {
    if (
      (merged[field] == null || merged[field] === "" ||
        (Array.isArray(merged[field]) && merged[field].length === 0)) &&
      latest[field] != null
    ) {
      merged[field] = latest[field];
    }
  }

  return merged;
}

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

  // Fetch latest monitoring entry and merge into UMKM data for empty fields
  const { data: latestMonitoring } = await supabaseAdmin
    .from("umkm_monitoring")
    .select("jumlah_tenaga_kerja, omzet, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok")
    .eq("umkm_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const merged = latestMonitoring
    ? mergeMonitoringIntoUmkm(data, latestMonitoring)
    : data;

  return NextResponse.json(merged);
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

  const now = new Date().toISOString();
  const { email, nik, ...umkmData } = body;

  // For user role: create edit request for admin verification
  if (currentUser.role === "user") {
    // Check for existing pending edit request
    const { data: existingRequest } = await supabaseAdmin
      .from("umkm_requests")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("umkm_id", id)
      .eq("action", "edit")
      .eq("status", "pending")
      .maybeSingle();

    if (existingRequest) {
      return NextResponse.json(
        { message: "Anda sudah memiliki permintaan edit yang sedang diproses. Silakan tunggu hingga diverifikasi." },
        { status: 409 },
      );
    }

    const { error: requestError } = await supabaseAdmin
      .from("umkm_requests")
      .insert({
        id: crypto.randomUUID(),
        user_id: currentUser.id,
        umkm_id: id,
        action: "edit",
        status: "pending",
        payload: {
          before: {
            nama: oldData.nama,
            pemilik: oldData.pemilik,
            kategori: oldData.kategori,
            subkategori: oldData.subkategori,
            deskripsi: oldData.deskripsi,
            kecamatan: oldData.kecamatan,
            alamat: oldData.alamat,
            lat: oldData.lat,
            lng: oldData.lng,
            whatsapp: oldData.whatsapp,
            instagram: oldData.instagram,
            facebook: oldData.facebook,
            tiktok: oldData.tiktok,
            nib: oldData.nib,
            kbli: oldData.kbli,
            npwp: oldData.npwp,
            halal: oldData.halal,
            pirt: oldData.pirt,
            haki: oldData.haki,
            tahun_mulai_usaha: oldData.tahun_mulai_usaha,
            jumlah_tenaga_kerja: oldData.jumlah_tenaga_kerja,
            omzet: oldData.omzet,
            gambar: oldData.gambar,
          },
          after: {
            ...umkmData,
            email: email ?? oldData.email,
            nik: nik ?? oldData.nik,
          },
        },
        created_at: now,
      });

    if (requestError) throw requestError;

    // Notify admin kecamatan
    const { data: admins } = await supabaseAdmin
      .from("admins")
      .select("id, roles ( name )");

    const adminIds = (admins ?? [])
      .filter((a: any) => {
        const roleName = Array.isArray(a.roles) ? a.roles[0]?.name : (a.roles as any)?.name;
        return roleName === "admin" || roleName === "super_admin" || roleName === "admin_kecamatan";
      })
      .map((a: any) => a.id);

    if (adminIds.length > 0) {
      const notifications = adminIds.map((adminId: string) => ({
        id: crypto.randomUUID(),
        admin_id: adminId,
        type: "edit_request",
        title: `Perubahan data UMKM "${oldData.nama}" menunggu verifikasi`,
        link: "/admin/verifikasi",
        created_at: now,
        read: false,
      }));
      await supabaseAdmin.from("notifications").insert(notifications);
    }

    // Notify owner
    await supabaseAdmin.from("notifications").insert({
      id: crypto.randomUUID(),
      user_id: currentUser.id,
      type: "edit_request",
      title: `Perubahan data UMKM "${oldData.nama}" sedang diverifikasi admin`,
      link: "/user/umkm",
      created_at: now,
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: "Perubahan data UMKM berhasil dikirim dan menunggu verifikasi admin.",
    });
  }

  // For admin role: direct update (no verification needed)
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
