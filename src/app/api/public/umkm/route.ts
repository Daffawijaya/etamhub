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

        // Calculate badge for each UMKM (merge monitoring with UMKM data)
        for (const umkm of umkms) {
          const count = countMap[umkm.id] || 0;
          const latestEntry = latestMap[umkm.id];
          if (latestEntry && criteriaConfig) {
            const merged = {
              omzet: latestEntry.omzet ?? umkm.omzet,
              jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? umkm.jumlah_tenaga_kerja,
              nib: latestEntry.nib ?? umkm.nib,
              halal: latestEntry.halal ?? umkm.halal,
              pirt: latestEntry.pirt ?? umkm.pirt,
              haki: latestEntry.haki ?? umkm.haki,
              instagram: latestEntry.instagram ?? umkm.instagram,
              facebook: latestEntry.facebook ?? umkm.facebook,
              tiktok: latestEntry.tiktok ?? umkm.tiktok,
            };
            badges[umkm.id] = calculateBadgeWithCriteria(merged, merged, count, criteriaConfig);
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
