import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// =========================
// GET — List all admin kecamatan
// =========================
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: admins, error } = await supabaseAdmin
      .from("admins")
      .select(
        `
        id,
        nama,
        username,
        is_active,
        created_at,
        roles ( name )
      `,
      )
      .eq("roles.name", "admin_kecamatan");

    if (error) throw error;

    const adminIds = (admins ?? []).map((a) => a.id);

    let kecamatanMap: Record<string, string[]> = {};

    if (adminIds.length > 0) {
      const { data: rels } = await supabaseAdmin
        .from("admin_kecamatan_kecamatan")
        .select("admin_id, kecamatan_id")
        .in("admin_id", adminIds);

      const allKecIds = [
        ...new Set((rels ?? []).map((r) => r.kecamatan_id)),
      ];

      let kecNames: Record<string, string> = {};

      if (allKecIds.length > 0) {
        const { data: kecData } = await supabaseAdmin
          .from("kecamatan")
          .select("id, nama")
          .in("id", allKecIds);

        for (const k of kecData ?? []) {
          kecNames[k.id] = k.nama;
        }
      }

      for (const rel of rels ?? []) {
        if (!kecamatanMap[rel.admin_id]) {
          kecamatanMap[rel.admin_id] = [];
        }
        kecamatanMap[rel.admin_id].push(
          kecNames[rel.kecamatan_id] ?? rel.kecamatan_id,
        );
      }
    }

    const result = (admins ?? []).map((admin) => ({
      id: admin.id,
      nama: admin.nama,
      username: admin.username,
      is_active: admin.is_active,
      created_at: admin.created_at,
      kecamatan: kecamatanMap[admin.id] ?? [],
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET ADMIN KECAMATAN ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}

// =========================
// POST — Create admin kecamatan
// =========================
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { nama, username, password, kecamatanIds } = body as {
      nama: string;
      username: string;
      password: string;
      kecamatanIds: string[];
    };

    if (!nama || !username || !password) {
      return NextResponse.json(
        { message: "Nama, username, dan password wajib diisi" },
        { status: 400 },
      );
    }

    if (!Array.isArray(kecamatanIds) || kecamatanIds.length === 0) {
      return NextResponse.json(
        { message: "Minimal pilih 1 kecamatan" },
        { status: 400 },
      );
    }

    // Cek username unik
    const { data: existing } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 409 },
      );
    }

    // Get role_id for admin_kecamatan
    const { data: role } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", "admin_kecamatan")
      .maybeSingle();

    if (!role) {
      return NextResponse.json(
        { message: "Role admin_kecamatan tidak ditemukan di database" },
        { status: 500 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const adminId = crypto.randomUUID();

    const { error: insertError } = await supabaseAdmin
      .from("admins")
      .insert({
        id: adminId,
        nama,
        username,
        password: passwordHash,
        role_id: role.id,
        is_active: true,
        created_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    // Insert kecamatan relations
    const rels = kecamatanIds.map((kecId) => ({
      admin_id: adminId,
      kecamatan_id: kecId,
    }));

    const { error: relError } = await supabaseAdmin
      .from("admin_kecamatan_kecamatan")
      .insert(rels);

    if (relError) throw relError;

    return NextResponse.json(
      { success: true, id: adminId },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST ADMIN KECAMATAN ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
