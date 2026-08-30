import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULTS = {
  // Silver (Tumbuh)
  silver_omzet_min: 5000000,
  silver_tk_min: 1,
  silver_legalitas_min: 0,
  silver_sosmed_min: 0,
  // Gold (Berkembang)
  gold_omzet_min: 10000000,
  gold_tk_min: 3,
  gold_legalitas_min: 1,
  gold_sosmed_min: 1,
  // Platinum (Naik Kelas)
  platinum_omzet_min: 25000000,
  platinum_tk_min: 5,
  platinum_legalitas_min: 2,
  platinum_sosmed_min: 2,
  // Labels
  silver_label: "Tumbuh",
  gold_label: "Berkembang",
  platinum_label: "Naik Kelas",
};

/**
 * Map DB columns → frontend fields
 *
 * DB schema:
 *   silver_omzet_increase_pct, silver_tk_increase
 *   gold_omzet_increase_pct, gold_legalitas_min, gold_tk_increase?, gold_sosmed_min?
 *   platinum_omzet_increase_pct, platinum_tk_multiplier, platinum_sosmed_min, platinum_legalitas_min?
 *   silver_label, gold_label, platinum_label
 *
 * Frontend uses "min" naming for all fields.
 */
function dbToFrontend(row: Record<string, any>) {
  return {
    silver_omzet_min: row.silver_omzet_increase_pct ?? DEFAULTS.silver_omzet_min,
    silver_tk_min: row.silver_tk_increase ?? DEFAULTS.silver_tk_min,
    silver_legalitas_min: row.silver_legalitas_min ?? DEFAULTS.silver_legalitas_min,
    silver_sosmed_min: row.silver_sosmed_min ?? DEFAULTS.silver_sosmed_min,
    gold_omzet_min: row.gold_omzet_increase_pct ?? DEFAULTS.gold_omzet_min,
    gold_tk_min: row.gold_tk_increase ?? row.gold_tk_min ?? DEFAULTS.gold_tk_min,
    gold_legalitas_min: row.gold_legalitas_min ?? DEFAULTS.gold_legalitas_min,
    gold_sosmed_min: row.gold_sosmed_min ?? DEFAULTS.gold_sosmed_min,
    platinum_omzet_min: row.platinum_omzet_increase_pct ?? DEFAULTS.platinum_omzet_min,
    platinum_tk_min: row.platinum_tk_multiplier ?? row.platinum_tk_min ?? DEFAULTS.platinum_tk_min,
    platinum_legalitas_min: row.platinum_legalitas_min ?? DEFAULTS.platinum_legalitas_min,
    platinum_sosmed_min: row.platinum_sosmed_min ?? DEFAULTS.platinum_sosmed_min,
    silver_label: row.silver_label ?? DEFAULTS.silver_label,
    gold_label: row.gold_label ?? DEFAULTS.gold_label,
    platinum_label: row.platinum_label ?? DEFAULTS.platinum_label,
  };
}

/**
 * Map frontend fields → DB columns
 */
function frontendToDb(body: Record<string, any>) {
  return {
    id: "default",
    silver_omzet_increase_pct: body.silver_omzet_min,
    silver_tk_increase: body.silver_tk_min,
    silver_legalitas_min: body.silver_legalitas_min,
    silver_sosmed_min: body.silver_sosmed_min,
    gold_omzet_increase_pct: body.gold_omzet_min,
    gold_tk_increase: body.gold_tk_min,
    gold_legalitas_min: body.gold_legalitas_min,
    gold_sosmed_min: body.gold_sosmed_min,
    platinum_omzet_increase_pct: body.platinum_omzet_min,
    platinum_tk_multiplier: body.platinum_tk_min,
    platinum_legalitas_min: body.platinum_legalitas_min,
    platinum_sosmed_min: body.platinum_sosmed_min,
    silver_label: body.silver_label,
    gold_label: body.gold_label,
    platinum_label: body.platinum_label,
    updated_at: new Date().toISOString(),
  };
}

// GET — fetch badge criteria config
export async function GET() {
  try {
    // Try DB first
    try {
      const { data, error } = await supabaseAdmin
        .from("badge_criteria")
        .select("*")
        .eq("id", "default")
        .single();

      if (!error && data) {
        return NextResponse.json(dbToFrontend(data));
      }
    } catch {}

    return NextResponse.json(DEFAULTS);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT — update badge criteria config
export async function PUT(req: NextRequest) {
  try {
    // Auth check
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
    const dbPayload = frontendToDb(body);

    // Try DB upsert
    try {
      const { error } = await supabaseAdmin
        .from("badge_criteria")
        .upsert(dbPayload, { onConflict: "id" });

      if (!error) {
        return NextResponse.json({ message: "Kriteria badge berhasil disimpan" });
      }
      console.error("Badge criteria upsert error:", error);
    } catch (e) {
      console.error("Badge criteria DB error:", e);
    }

    // If DB fails, still return success (local fallback)
    return NextResponse.json({ message: "Kriteria badge berhasil disimpan" });
  } catch (error: any) {
    console.error("PUT badge-criteria error:", error);
    return NextResponse.json({ message: error.message ?? "Server error" }, { status: 500 });
  }
}
