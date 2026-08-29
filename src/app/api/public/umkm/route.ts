import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadgeWithCriteria, getBadgeCriteria, type BadgeCriteria } from "@/lib/monitoring/badges";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("umkm")
      .select("*", { count: "exact" })
      .eq("published", true)

    if (kecamatan) {
      query = query.eq("kecamatan", kecamatan);
    }

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }

    query = query.order("created_at", {
      ascending: false,
    });

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const umkms = data ?? [];

    // Fetch badges for all UMKMs in this batch
    const umkmIds = umkms.map((u) => u.id);
    let badges: Record<string, any> = {};
    let criteriaConfig: BadgeCriteria | null = null;

    if (umkmIds.length > 0) {
      criteriaConfig = await getBadgeCriteria();

      // Fetch monitoring counts and latest entries for each UMKM
      const { data: monitoringCounts } = await supabaseAdmin
        .from("umkm_monitoring")
        .select("umkm_id")
        .in("umkm_id", umkmIds);

      // Group count by umkm_id
      const countMap: Record<string, number> = {};
      (monitoringCounts ?? []).forEach((m) => {
        countMap[m.umkm_id] = (countMap[m.umkm_id] || 0) + 1;
      });

      // Fetch latest monitoring for each UMKM that has monitoring
      const umkmsWithMonitoring = Object.keys(countMap);
      if (umkmsWithMonitoring.length > 0) {
        const { data: latestMonitorings } = await supabaseAdmin
          .from("umkm_monitoring")
          .select("umkm_id, jumlah_tenaga_kerja, omzet, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok")
          .in("umkm_id", umkmsWithMonitoring)
          .order("created_at", { ascending: false });

        // Get only the latest per umkm_id
        const latestMap: Record<string, any> = {};
        (latestMonitorings ?? []).forEach((m) => {
          if (!latestMap[m.umkm_id]) {
            latestMap[m.umkm_id] = m;
          }
        });

        // Calculate badge for each UMKM (same logic as admin monitoring API)
        for (const umkm of umkms) {
          const count = countMap[umkm.id] || 0;
          const latestEntry = latestMap[umkm.id];
          if (latestEntry && criteriaConfig) {
            // Initial = umkm record data
            const initial = {
              omzet: umkm.omzet ?? null,
              jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
              nib: umkm.nib ?? null,
              halal: umkm.halal ?? null,
              pirt: umkm.pirt ?? null,
              haki: umkm.haki ?? null,
              instagram: umkm.instagram ?? null,
              facebook: umkm.facebook ?? null,
              tiktok: umkm.tiktok ?? null,
            };
            // Latest: omzet & TK strict (no fallback), legalitas & sosmed fallback
            const latest = {
              omzet: latestEntry.omzet ?? null,
              jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? null,
              nib: latestEntry.nib ?? initial.nib,
              halal: latestEntry.halal ?? initial.halal,
              pirt: latestEntry.pirt ?? initial.pirt,
              haki: latestEntry.haki ?? initial.haki,
              instagram: latestEntry.instagram ?? initial.instagram,
              facebook: latestEntry.facebook ?? initial.facebook,
              tiktok: latestEntry.tiktok ?? initial.tiktok,
            };
            badges[umkm.id] = calculateBadgeWithCriteria(initial, latest, count, criteriaConfig);
          }
        }
      }
    }

    return NextResponse.json({
      data: umkms.map((u) => ({ ...u, badge: badges[u.id] ?? null })),
      total: count ?? 0,
      page,
      limit,
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
