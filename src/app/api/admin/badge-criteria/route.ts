import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULTS = {
  silver_omzet_min: 5000000,
  silver_tk_min: 1,
  silver_legalitas_min: 0,
  silver_sosmed_min: 0,
  gold_omzet_min: 10000000,
  gold_tk_min: 3,
  gold_legalitas_min: 1,
  gold_sosmed_min: 1,
  platinum_omzet_min: 25000000,
  platinum_tk_min: 5,
  platinum_legalitas_min: 2,
  platinum_sosmed_min: 2,
  silver_label: "Tumbuh",
  gold_label: "Berkembang",
  platinum_label: "Naik Kelas",
};

// GET
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("badge_criteria")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return NextResponse.json(DEFAULTS);
    }

    return NextResponse.json({
      silver_omzet_min: data.silver_omzet_min ?? DEFAULTS.silver_omzet_min,
      silver_tk_min: data.silver_tk_min ?? DEFAULTS.silver_tk_min,
      silver_legalitas_min: data.silver_legalitas_min ?? DEFAULTS.silver_legalitas_min,
      silver_sosmed_min: data.silver_sosmed_min ?? DEFAULTS.silver_sosmed_min,
      gold_omzet_min: data.gold_omzet_min ?? DEFAULTS.gold_omzet_min,
      gold_tk_min: data.gold_tk_min ?? DEFAULTS.gold_tk_min,
      gold_legalitas_min: data.gold_legalitas_min ?? DEFAULTS.gold_legalitas_min,
      gold_sosmed_min: data.gold_sosmed_min ?? DEFAULTS.gold_sosmed_min,
      platinum_omzet_min: data.platinum_omzet_min ?? DEFAULTS.platinum_omzet_min,
      platinum_tk_min: data.platinum_tk_min ?? DEFAULTS.platinum_tk_min,
      platinum_legalitas_min: data.platinum_legalitas_min ?? DEFAULTS.platinum_legalitas_min,
      platinum_sosmed_min: data.platinum_sosmed_min ?? DEFAULTS.platinum_sosmed_min,
      silver_label: data.silver_label ?? DEFAULTS.silver_label,
      gold_label: data.gold_label ?? DEFAULTS.gold_label,
      platinum_label: data.platinum_label ?? DEFAULTS.platinum_label,
    });
  } catch (error: any) {
    console.error("GET badge-criteria error:", error);
    return NextResponse.json(DEFAULTS);
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    // Auth
    let user = null;
    try {
      user = await getCurrentUser();
    } catch {}

    if (!user) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const userId = cookieStore.get("user_id")?.value;
        const role = cookieStore.get("role")?.value;
        if (userId && (role === "super_admin" || role === "admin")) {
          user = { id: userId, nama: null, username: null, nik: null, email: null, role, roleId: null, kecamatanIds: [], kecamatan: [] };
        }
      } catch {}
    }

    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const payload = {
      id: "default",
      silver_omzet_min: body.silver_omzet_min,
      silver_tk_min: body.silver_tk_min,
      silver_legalitas_min: body.silver_legalitas_min,
      silver_sosmed_min: body.silver_sosmed_min,
      gold_omzet_min: body.gold_omzet_min,
      gold_tk_min: body.gold_tk_min,
      gold_legalitas_min: body.gold_legalitas_min,
      gold_sosmed_min: body.gold_sosmed_min,
      platinum_omzet_min: body.platinum_omzet_min,
      platinum_tk_min: body.platinum_tk_min,
      platinum_legalitas_min: body.platinum_legalitas_min,
      platinum_sosmed_min: body.platinum_sosmed_min,
      silver_label: body.silver_label,
      gold_label: body.gold_label,
      platinum_label: body.platinum_label,
      updated_at: new Date().toISOString(),
    };

    // Upsert to DB
    const { data, error } = await supabaseAdmin
      .from("badge_criteria")
      .upsert(payload, { onConflict: "id" })
      .select();

    if (error) {
      console.error("PUT badge-criteria upsert error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Kriteria badge berhasil disimpan", data: data?.[0] });
  } catch (error: any) {
    console.error("PUT badge-criteria error:", error);
    return NextResponse.json({ message: error.message ?? "Server error" }, { status: 500 });
  }
}
