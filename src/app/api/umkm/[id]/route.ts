import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import {
  normalizeUmkmBody,
  validateUmkmBody,
  normalizeNullable,
} from "@/lib/validation";
import { getUmkmDetail } from "@/lib/umkm/detail";

// =========================
// GET UMKM BY ID / SLUG
// =========================

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const merged = await getUmkmDetail(id);

  if (!merged) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

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

  // For user role: create edit request for admin verification (fix BUG #6: user_umkm)
  if (currentUser.role === "user_umkm" || currentUser.role === "user") {
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

  // For admin role: direct update (fix BUG #7: pakai owner_id bukan currentUser.id)
  if (email || nik) {
    const targetUserId = oldData.owner_id ?? currentUser.id;
    const upd: Record<string, any> = { updated_at: now };
    if (email) upd.email = email;
    if (nik) upd.nik = nik;
    // cek unique sebelum update
    if (nik) {
      const { data: clash } = await supabaseAdmin.from("umkm").select("id").eq("nik", nik).neq("id", id).maybeSingle();
      if (clash) return NextResponse.json({ message: "NIK sudah memiliki UMKM." }, { status: 409 });
    }
    const { error: userError } = await supabaseAdmin.from("users").update(upd).eq("id", targetUserId);

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

  const umkmUpdate: Record<string, any> = { ...umkmData, updated_at: now };
  if (nik) umkmUpdate.nik = nik;
  const { data: updatedData, error: updateError } = await supabaseAdmin
    .from("umkm")
    .update(umkmUpdate)
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
