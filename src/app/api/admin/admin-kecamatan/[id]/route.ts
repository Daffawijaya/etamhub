import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// =========================
// PUT — Update admin kecamatan
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || !['super_admin', 'admin'].includes(user.role ?? '')) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { nama, username, password, is_active, kecamatanIds } = body as {
      nama?: string;
      username?: string;
      password?: string;
      is_active?: boolean;
      kecamatanIds?: string[];
    };

    // Check if admin exists
    const { data: existing } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { message: "Admin tidak ditemukan" },
        { status: 404 },
      );
    }

    // Update basic fields
    const updateData: Record<string, any> = {};

    if (nama !== undefined) updateData.nama = nama;
    if (is_active !== undefined) updateData.is_active = is_active;

    if (username !== undefined) {
      const { data: dupCheck } = await supabaseAdmin
        .from("admins")
        .select("id")
        .eq("username", username)
        .neq("id", id)
        .maybeSingle();

      if (dupCheck) {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 409 },
        );
      }

      updateData.username = username;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabaseAdmin
        .from("admins")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    }

    // Update kecamatan relations
    if (Array.isArray(kecamatanIds)) {
      await supabaseAdmin
        .from("admin_kecamatan_kecamatan")
        .delete()
        .eq("admin_id", id);

      if (kecamatanIds.length > 0) {
        const rels = kecamatanIds.map((kecId) => ({
          admin_id: id,
          kecamatan_id: kecId,
        }));

        const { error: relError } = await supabaseAdmin
          .from("admin_kecamatan_kecamatan")
          .insert(rels);

        if (relError) throw relError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT ADMIN KECAMATAN ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}

// =========================
// DELETE — Remove admin kecamatan
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || !['super_admin', 'admin'].includes(user.role ?? '')) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    // Delete kecamatan relations first
    await supabaseAdmin
      .from("admin_kecamatan_kecamatan")
      .delete()
      .eq("admin_id", id);

    const { error } = await supabaseAdmin
      .from("admins")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE ADMIN KECAMATAN ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
