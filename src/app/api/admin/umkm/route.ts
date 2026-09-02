import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  normalizeUmkmBody,
  validateUmkmBody,
  normalizeNullable,
} from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");

    let query = supabaseAdmin
      .from("umkm")
      .select("*", { count: "exact" })
      .order("created_at", {
        ascending: false,
      });

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (kecamatan) {
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", kecamatan)
        .maybeSingle();

      if (kecamatanData) {
        query = query.eq("kecamatan_id", kecamatanData.id);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data,
      total: count,
    });
  } catch (error: any) {
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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    normalizeUmkmBody(body);

    // Admin wajib isi NIK 16 digit (1 NIK = 1 UMKM, untuk auto-konek saat pemilik daftar)
    if (!body.nik || !/^\d{16}$/.test(body.nik)) {
      return NextResponse.json({ message: "NIK wajib 16 digit angka." }, { status: 400 });
    }

    const validationError = validateUmkmBody(body);
    if (validationError) {
      return NextResponse.json(
        {
          message: validationError.message,
        },
        {
          status: 400,
        },
      );
    }

    // 1 NIK = 1 UMKM: cek duplikat di umkm
    const { data: existingUmkmNik } = await supabaseAdmin.from("umkm").select("id").eq("nik", body.nik).maybeSingle();
    if (existingUmkmNik) {
      return NextResponse.json({ message: "NIK sudah memiliki UMKM." }, { status: 409 });
    }
    // Jika owner_id dikirim, pastikan belum punya UMKM lain (double safety)
    let resolvedOwnerId: string | null = null;
    if (body.owner_id) {
      const { data: ownerUmkm } = await supabaseAdmin.from("umkm").select("id").eq("owner_id", body.owner_id).maybeSingle();
      if (ownerUmkm) return NextResponse.json({ message: "User tersebut sudah memiliki UMKM." }, { status: 409 });
      resolvedOwnerId = body.owner_id;
    } else {
      // Auto-link jika user dengan NIK ini sudah ada dan belum punya UMKM
      const { data: existingUser } = await supabaseAdmin.from("users").select("id").eq("nik", body.nik).maybeSingle();
      if (existingUser) {
        const { data: userUmkm } = await supabaseAdmin.from("umkm").select("id").eq("owner_id", existingUser.id).maybeSingle();
        if (userUmkm) return NextResponse.json({ message: "NIK sudah memiliki UMKM." }, { status: 409 });
        resolvedOwnerId = existingUser.id;
      }
    }

    if (body.kecamatan) {
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", body.kecamatan)
        .maybeSingle();

      if (!kecamatanData) {
        return NextResponse.json(
          {
            message: "Kecamatan tidak ditemukan",
          },
          {
            status: 400,
          },
        );
      }

      body.kecamatan_id = kecamatanData.id;
    }

    const now = new Date().toISOString();

    const { email, nik, ...umkmData } = body;

    const { data, error } = await supabaseAdmin
      .from("umkm")
      .insert({
        id: crypto.randomUUID(),
        ...umkmData,
        nik,
        owner_id: resolvedOwnerId, // null = orphan, auto-konek saat pemilik daftar
        approval_status: "approved",
        approved_by: user.id,
        approved_at: now,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Sync NIK/email ke user jika sudah ter-link (jangan overwrite jika null)
    if (resolvedOwnerId) {
      const updatePayload: Record<string, unknown> = { updated_at: now };
      if (nik) updatePayload.nik = nik;
      if (email) updatePayload.email = email;
      await supabaseAdmin.from("users").update(updatePayload).eq("id", resolvedOwnerId);
    }

    await supabaseAdmin.from("notifications").insert({
      id: crypto.randomUUID(),
      admin_id: user.id,
      type: "create",
      title: `Admin menambahkan UMKM ${data.nama}`,
      link: "/admin/umkm",
      created_at: now,
      read: false,
    });

    // Notify owner if exists (resolvedOwnerId includes auto-link via NIK)
    if (resolvedOwnerId) {
      await supabaseAdmin.from("notifications").insert({
        id: crypto.randomUUID(),
        user_id: resolvedOwnerId,
        type: "approval",
        title: `UMKM "${data.nama}" telah dibuat oleh admin`,
        link: "/user/umkm",
        created_at: now,
        read: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("ADMIN POST UMKM ERROR:", error);

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
