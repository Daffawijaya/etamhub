import crypto from "crypto";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  normalizeUmkmBody,
  validateUmkmBody,
  normalizeNullable,
} from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("mode");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");

    const allowedSort = ["nama", "created_at"];
    const sortParam = searchParams.get("sort");

    const sort = allowedSort.includes(sortParam ?? "")
      ? sortParam!
      : "created_at";

    const order = searchParams.get("order") === "asc";

    const page = Number(searchParams.get("page") || 1);
    const requestedLimit = Number(searchParams.get("limit") || 10);
    const limit = Math.min(requestedLimit, 1000);

    let umkmQuery = supabaseAdmin.from("umkm").select("*", { count: "exact" });

    // Public
    if (!user) {
      umkmQuery = umkmQuery.eq("published", true);
    }

    // Super Admin bisa lihat semua saat mode admin
    if (user?.role === "super_admin" && mode === "admin") {
      // no filter
    }

    // User hanya melihat UMKM miliknya
    if (user?.role === "user_umkm") {
      umkmQuery = umkmQuery.eq("owner_id", user.id);
    }

    // Admin kecamatan hanya melihat UMKM di kecamatannya
    if (user?.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      umkmQuery = umkmQuery.in("kecamatan_id", user.kecamatanIds);
    }

    if (kecamatan) {
      const { data: kecamatanData } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", kecamatan)
        .maybeSingle();

      if (kecamatanData) {
        umkmQuery = umkmQuery.eq("kecamatan_id", kecamatanData.id);
      }
    }

    if (kategori) {
      umkmQuery = umkmQuery.eq("kategori", kategori);
    }

    if (status === "public") {
      umkmQuery = umkmQuery.eq("published", true);
    }

    if (status === "private") {
      umkmQuery = umkmQuery.eq("published", false);
    }

    if (search) {
      umkmQuery = umkmQuery.ilike("nama", `%${search}%`);
    }

    umkmQuery = umkmQuery.order(sort, {
      ascending: order,
    });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    umkmQuery = umkmQuery.range(from, to);

    let filtersQuery = supabaseAdmin
      .from("umkm")
      .select("kecamatan, kategori");

    if (user?.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      filtersQuery = filtersQuery.in("kecamatan_id", user.kecamatanIds);
    }

    const { data: filtersData } = await filtersQuery;

    const kecamatanOptions = [
      ...new Set(filtersData?.map((item) => item.kecamatan).filter(Boolean)),
    ];

    const kategoriOptions = [
      ...new Set(filtersData?.map((item) => item.kategori).filter(Boolean)),
    ];

    const { data, error, count } = await umkmQuery;

    if (error) throw error;

    return NextResponse.json({
      data,
      total: count,
      page,
      limit,
      filters: {
        kecamatan: kecamatanOptions,
        kategori: kategoriOptions,
      },
    });
  } catch (error: any) {
    console.error("GET UMKM ERROR:", error);

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

    const body = await req.json();

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

    if (user.role !== "user_umkm") {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }
    const { data: existingUserUmkm } = await supabaseAdmin
      .from("umkm")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existingUserUmkm) {
      return NextResponse.json(
        {
          message: "Akun ini sudah memiliki UMKM.",
        },
        {
          status: 409,
        },
      );
    }

    normalizeUmkmBody(body);

    const { data: existingNik } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("nik", body.nik)
      .maybeSingle();

    if (existingNik && existingNik.id !== user.id) {
      return NextResponse.json(
        {
          message: "NIK sudah terdaftar.",
        },
        {
          status: 409,
        },
      );
    }

    if (body.nib) {
      const { data: existingNib } = await supabaseAdmin
        .from("umkm")
        .select("id")
        .eq("nib", body.nib)
        .maybeSingle();

      if (existingNib) {
        return NextResponse.json(
          {
            message: "NIB sudah terdaftar.",
          },
          {
            status: 409,
          },
        );
      }
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

    const { data: existingEmail } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", body.email)
      .maybeSingle();

    if (existingEmail && existingEmail.id !== user.id) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan.",
        },
        {
          status: 409,
        },
      );
    }

    if (body.kecamatan) {
      const { data: kecamatanData, error } = await supabaseAdmin
        .from("kecamatan")
        .select("id")
        .eq("nama", body.kecamatan)
        .maybeSingle();

      if (error || !kecamatanData) {
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

    if (user) {
      const { error: userError } = await supabaseAdmin
        .from("users")
        .update({
          email: body.email,
          nik: body.nik,
          updated_at: now,
        })
        .eq("id", user.id);

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

    const { email, nik, ...umkmData } = body;

    // Simpan ke umkm_requests, bukan ke umkm langsung
    // Admin kecamatan harus approve dulu sebelum masuk tabel umkm
    const requestId = crypto.randomUUID();

    const { error } = await supabaseAdmin
      .from("umkm_requests")
      .insert({
        id: requestId,
        user_id: user.id,
        action: "create",
        status: "pending",
        payload: {
          ...umkmData,
          owner_id: user.id,
        },
        created_at: now,
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "UMKM berhasil dikirim untuk diverifikasi admin kecamatan",
      request_id: requestId,
    });
  } catch (error: any) {
    console.error("POST UMKM ERROR:", error);

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
