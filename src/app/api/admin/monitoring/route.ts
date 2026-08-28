import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadge } from "@/lib/monitoring/badges";

// =========================
// GET — List UMKM with latest monitoring, pagination & filters
// =========================
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const allowedRoles = ["super_admin", "admin", "admin_kecamatan"];
    if (!allowedRoles.includes(user.role ?? "")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const search = searchParams.get("search") ?? "";
    const badgeFilter = searchParams.get("badge") ?? "all";
    const monitoredFilter = searchParams.get("monitored") ?? "all"; // "yes" | "no" | "all"
    const omzetMin = searchParams.get("omzet_min");
    const omzetMax = searchParams.get("omzet_max");
    const kecamatanFilter = searchParams.get("kecamatan") ?? "all";
    const sort = searchParams.get("sort") ?? "nama";
    const order = searchParams.get("order") === "desc" ? false : true;

    // Get UMKM from assigned kecamatan
    let umkmQuery = supabaseAdmin
      .from("umkm")
      .select("id, nama, pemilik, kategori, kecamatan, kecamatan_id, gambar, omzet, jumlah_tenaga_kerja, halal, pirt, haki, nib, instagram, facebook, tiktok")
      .eq("published", true);

    if (user.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      umkmQuery = umkmQuery.or(
        `kecamatan_id.in.(${user.kecamatanIds.join(",")}),kecamatan.in.(${user.kecamatan.join(",")})`,
      );
    }

    if (search) {
      umkmQuery = umkmQuery.or(`nama.ilike.%${search}%,pemilik.ilike.%${search}%`);
    }

    if (kecamatanFilter !== "all") {
      umkmQuery = umkmQuery.eq("kecamatan", kecamatanFilter);
    }

    const { data: umkms, error: umkmError } = await umkmQuery;

    if (umkmError) throw umkmError;

    // Get latest monitoring for each UMKM
    const umkmIds = (umkms ?? []).map((u) => u.id);

    let monitoringMap: Record<string, any> = {};

    if (umkmIds.length > 0) {
      const { data: monitorings } = await supabaseAdmin
        .from("umkm_monitoring")
        .select("*")
        .in("umkm_id", umkmIds)
        .order("created_at", { ascending: false });

      for (const m of monitorings ?? []) {
        if (!monitoringMap[m.umkm_id]) {
          monitoringMap[m.umkm_id] = m;
        }
      }
    }

    // Get monitoring count per UMKM
    const { data: counts } = umkmIds.length > 0
      ? await supabaseAdmin
          .from("umkm_monitoring")
          .select("umkm_id")
          .in("umkm_id", umkmIds)
      : { data: [] };

    const countMap: Record<string, number> = {};
    for (const c of counts ?? []) {
      countMap[c.umkm_id] = (countMap[c.umkm_id] || 0) + 1;
    }

    // Build full results with badges
    const allResults = await Promise.all((umkms ?? []).map(async (umkm) => {
      const monitoringCount = countMap[umkm.id] ?? 0;
      const latestEntry = monitoringMap[umkm.id] ?? null;

      // initial = UMKM self-reported data (for reference only, NOT used for badge)
      const initial = {
        omzet: umkm.omzet ?? null,
        jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
        halal: umkm.halal ?? null,
        pirt: umkm.pirt ?? null,
        haki: umkm.haki ?? null,
        nib: umkm.nib ?? null,
        instagram: umkm.instagram ?? null,
        facebook: umkm.facebook ?? null,
        tiktok: umkm.tiktok ?? null,
      };

      // latest = monitoring data ONLY (no fallback to UMKM self-reported data)
      // Badge only counts from actual monitoring visits
      const latest = latestEntry
        ? {
            omzet: latestEntry.omzet ?? null,
            jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? null,
            halal: latestEntry.halal ?? null,
            pirt: latestEntry.pirt ?? null,
            haki: latestEntry.haki ?? null,
            nib: latestEntry.nib ?? null,
            instagram: latestEntry.instagram ?? null,
            facebook: latestEntry.facebook ?? null,
            tiktok: latestEntry.tiktok ?? null,
          }
        : null;

      const badge = await calculateBadge(initial, latest, monitoringCount);

      return {
        id: umkm.id,
        nama: umkm.nama,
        pemilik: umkm.pemilik,
        kategori: umkm.kategori,
        kecamatan: umkm.kecamatan,
        kecamatan_id: umkm.kecamatan_id,
        gambar: umkm.gambar,
        latestMonitoring: latestEntry,
        monitoringCount,
        badge,
      };
    }));

    // Apply filters after badge calculation
    let filtered = allResults;

    // Badge filter
    if (badgeFilter !== "all") {
      filtered = filtered.filter((item) => item.badge.level === badgeFilter);
    }

    // Monitored filter
    if (monitoredFilter === "yes") {
      filtered = filtered.filter((item) => item.monitoringCount > 0);
    } else if (monitoredFilter === "no") {
      filtered = filtered.filter((item) => item.monitoringCount === 0);
    }

    // Omzet filter
    if (omzetMin) {
      const min = Number(omzetMin);
      filtered = filtered.filter((item) => (item.latestMonitoring?.omzet ?? item.badge.criteria.omzet ?? 0) >= min);
    }
    if (omzetMax) {
      const max = Number(omzetMax);
      filtered = filtered.filter((item) => (item.latestMonitoring?.omzet ?? item.badge.criteria.omzet ?? 0) <= max);
    }

    // Collect unique kecamatan for filter options
    const kecamatanList = [...new Set(allResults.map((r) => r.kecamatan).filter(Boolean))].sort();

    const total = filtered.length;

    // Sort
    if (sort === "nama") {
      filtered.sort((a, b) => order ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama));
    } else if (sort === "monitoring") {
      filtered.sort((a, b) => order ? a.monitoringCount - b.monitoringCount : b.monitoringCount - a.monitoringCount);
    } else if (sort === "badge") {
      const badgeOrder = { none: 0, bronze: 1, silver: 2, gold: 3, platinum: 4 };
      filtered.sort((a, b) => order
        ? (badgeOrder[a.badge.level as keyof typeof badgeOrder] ?? 0) - (badgeOrder[b.badge.level as keyof typeof badgeOrder] ?? 0)
        : (badgeOrder[b.badge.level as keyof typeof badgeOrder] ?? 0) - (badgeOrder[a.badge.level as keyof typeof badgeOrder] ?? 0)
      );
    }

    // Paginate
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data,
      total,
      filters: {
        kecamatan: kecamatanList,
      },
    });
  } catch (error: any) {
    console.error("GET MONITORING ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
