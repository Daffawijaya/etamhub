import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import { calculateBadgeWithCriteria, getBadgeCriteria } from "@/lib/monitoring/badges";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdminKecamatan = user.role === "admin_kecamatan";
    const kecamatanIds = user.kecamatanIds ?? [];
    const kecamatanNames = user.kecamatan ?? [];

    // =========================
    // UMKM — filtered by kecamatan for admin kecamatan
    // =========================
    let query = supabaseAdmin
      .from("umkm")
      .select("*")
      .order("created_at", { ascending: false });

    if (isAdminKecamatan && kecamatanIds.length > 0) {
      query = query.or(
        `kecamatan_id.in.(${kecamatanIds.join(",")}),kecamatan.in.(${kecamatanNames.join(",")})`,
      );
    }

    const { data: umkms, error } = await query;
    if (error) throw error;

    const dataUmkm = umkms ?? [];

    // =========================
    // STATS
    // =========================
    const totalUmkm = dataUmkm.length;

    const kategoriMap = dataUmkm.reduce((acc: any, item) => {
      const kategori = item.kategori || "Lainnya";
      acc[kategori] = (acc[kategori] || 0) + 1;
      return acc;
    }, {});

    const kecamatanMap = dataUmkm.reduce((acc: any, item) => {
      const kecamatan = item.kecamatan || "Tidak diketahui";
      acc[kecamatan] = (acc[kecamatan] || 0) + 1;
      return acc;
    }, {});

    if (isAdminKecamatan && kecamatanIds.length > 0) {
      const { data: allKec } = await supabaseAdmin
        .from("kecamatan")
        .select("nama")
        .in("id", kecamatanIds);

      for (const kec of allKec ?? []) {
        if (!kecamatanMap[kec.nama]) {
          kecamatanMap[kec.nama] = 0;
        }
      }
    }

    const subkategoriSet = new Set(
      dataUmkm.map((item) => item.subkategori).filter(Boolean),
    );

    // =========================
    // ACTIVITIES
    // =========================
    const { data: activities, error: activityError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (activityError) throw activityError;

    // =========================
    // CHARTS
    // =========================
    const kategoriChart = Object.entries(kategoriMap).map(([name, value]) => ({
      name,
      value,
    }));

    const kecamatanChart = Object.entries(kecamatanMap).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    // =========================
    // MONITORING DATA
    // =========================
    const umkmIds = dataUmkm.map((u) => u.id);

    // Fetch all monitoring entries for omzet trend
    let allMonitorings: any[] = [];
    if (umkmIds.length > 0) {
      // Need to chunk IDs for large datasets
      const chunkSize = 50;
      for (let i = 0; i < umkmIds.length; i += chunkSize) {
        const chunk = umkmIds.slice(i, i + chunkSize);
        const { data: chunkData } = await supabaseAdmin
          .from("umkm_monitoring")
          .select("umkm_id, omzet, created_at")
          .in("umkm_id", chunk)
          .order("created_at", { ascending: false });

        allMonitorings.push(...(chunkData ?? []));
      }
    }

    // Get latest monitoring per UMKM for badge calculation
    const latestMap: Record<string, any> = {};
    const countMap: Record<string, number> = {};
    for (const m of allMonitorings) {
      countMap[m.umkm_id] = (countMap[m.umkm_id] || 0) + 1;
      if (!latestMap[m.umkm_id]) {
        latestMap[m.umkm_id] = m;
      }
    }

    // Calculate badge distribution
    const badgeConfig = await getBadgeCriteria();
    const badgeCounts: Record<string, number> = {
      none: 0,
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    };

    let totalOmzet = 0;
    let omzetCount = 0;

    for (const umkm of dataUmkm) {
      const monitoringCount = countMap[umkm.id] ?? 0;
      const latestEntry = latestMap[umkm.id] ?? null;

      const initial = {
        omzet: umkm.omzet ?? null,
        jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
        halal: umkm.halal ?? null,
        pirt: umkm.pirt ?? null,
        haki: umkm.haki ?? null,
        instagram: umkm.instagram ?? null,
        facebook: umkm.facebook ?? null,
        tiktok: umkm.tiktok ?? null,
      };

      const latest = latestEntry
        ? {
            omzet: latestEntry.omzet ?? null,
            jumlah_tenaga_kerja: null,
            halal: null,
            pirt: null,
            haki: null,
            instagram: null,
            facebook: null,
            tiktok: null,
          }
        : null;

      const badge = calculateBadgeWithCriteria(initial, latest, monitoringCount, badgeConfig);
      badgeCounts[badge.level] = (badgeCounts[badge.level] || 0) + 1;

      // Track omzet for average
      if (latestEntry?.omzet) {
        totalOmzet += latestEntry.omzet;
        omzetCount++;
      }
    }

    const badgeChart = [
      { name: "Pemula", value: badgeCounts.bronze, color: "#F59E0B" },
      { name: "Tumbuh", value: badgeCounts.silver, color: "#10B981" },
      { name: "Berkembang", value: badgeCounts.gold, color: "#844EC0" },
      { name: "Naik Kelas", value: badgeCounts.platinum, color: "#CA3785" },
    ];

    // Omzet trend — monthly average from monitoring data
    const monthlyOmzet: Record<string, { total: number; count: number }> = {};
    for (const m of allMonitorings) {
      if (!m.omzet || m.omzet <= 0) continue;
      const date = new Date(m.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyOmzet[key]) {
        monthlyOmzet[key] = { total: 0, count: 0 };
      }
      monthlyOmzet[key].total += m.omzet;
      monthlyOmzet[key].count++;
    }

    // Sort by month and take last 12
    const omzetTrend = Object.entries(monthlyOmzet)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => {
        const [year, m] = month.split("-");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        return {
          month: `${monthNames[parseInt(m) - 1]} ${year.slice(2)}`,
          avgOmzet: Math.round(data.total / data.count),
          totalOmzet: data.total,
          jumlahEntry: data.count,
        };
      });

    // Total monitored UMKM
    const monitoredCount = Object.keys(countMap).length;
    const totalMonitorings = allMonitorings.length;

    return NextResponse.json({
      stats: {
        totalUmkm,
        totalKategori: kategoriChart.length,
        totalKecamatan: kecamatanChart.length,
        totalSubkategori: subkategoriSet.size,
      },
      latest: dataUmkm.slice(0, 5),
      kategoriChart,
      kecamatanChart,
      activities: activities ?? [],
      map: dataUmkm,
      monitoring: {
        badgeChart,
        omzetTrend,
        monitoredCount,
        totalMonitorings,
        avgOmzet: omzetCount > 0 ? Math.round(totalOmzet / omzetCount) : 0,
        badgeCounts,
      },
    });
  } catch (error: any) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
