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
          .select("*")
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
        nib: umkm.nib ?? null,
        instagram: umkm.instagram ?? null,
        facebook: umkm.facebook ?? null,
        tiktok: umkm.tiktok ?? null,
      };

      const latest = latestEntry
        ? {
            omzet: latestEntry.omzet ?? null,
            jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? null,
            halal: latestEntry.halal ?? initial.halal,
            pirt: latestEntry.pirt ?? initial.pirt,
            haki: latestEntry.haki ?? initial.haki,
            nib: latestEntry.nib ?? initial.nib,
            instagram: latestEntry.instagram ?? initial.instagram,
            facebook: latestEntry.facebook ?? initial.facebook,
            tiktok: latestEntry.tiktok ?? initial.tiktok,
          }
        : initial;

      const badge = calculateBadgeWithCriteria(initial, latest, monitoringCount, badgeConfig);
      badgeCounts[badge.level] = (badgeCounts[badge.level] || 0) + 1;

      // Track omzet for average
      if (latestEntry?.omzet) {
        totalOmzet += latestEntry.omzet;
        omzetCount++;
      }
    }

    const badgeChart = [
      { name: "Belum Dimonitoring", value: badgeCounts.none, color: "#E8E8EE" },
      { name: "Pemula", value: badgeCounts.bronze, color: "#10B981" },
      { name: "Tumbuh", value: badgeCounts.silver, color: "#94A3B8" },
      { name: "Berkembang", value: badgeCounts.gold, color: "#F59E0B" },
      { name: "Naik Kelas", value: badgeCounts.platinum, color: "#7C3AED" },
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

    // Digitalisasi & Legalitas stats
    let digitalCount = 0;
    let legalitasCount = 0;
    for (const umkm of dataUmkm) {
      const hasDigital = !!(umkm.instagram || umkm.facebook || umkm.tiktok);
      const hasLegalitas = !!(umkm.halal || umkm.pirt || umkm.haki || umkm.nib);
      if (hasDigital) digitalCount++;
      if (hasLegalitas) legalitasCount++;
    }

    return NextResponse.json({
      stats: {
        totalUmkm,
        totalKategori: kategoriChart.length,
        totalKecamatan: kecamatanChart.length,
        totalSubkategori: subkategoriSet.size,
        digitalCount,
        legalitasCount,
        digitalPercent: totalUmkm > 0 ? Math.round((digitalCount / totalUmkm) * 100) : 0,
        legalitasPercent: totalUmkm > 0 ? Math.round((legalitasCount / totalUmkm) * 100) : 0,
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
        monitoredIds: Object.keys(countMap),
        umkmBadges: dataUmkm.map((u) => ({
          id: u.id,
          level: (calculateBadgeWithCriteria(
            {
              omzet: u.omzet ?? null,
              jumlah_tenaga_kerja: u.jumlah_tenaga_kerja ?? null,
              halal: u.halal ?? null,
              pirt: u.pirt ?? null,
              haki: u.haki ?? null,
              nib: u.nib ?? null,
              instagram: u.instagram ?? null,
              facebook: u.facebook ?? null,
              tiktok: u.tiktok ?? null,
            },
            latestMap[u.id]
              ? {
                  omzet: latestMap[u.id].omzet ?? null,
                  jumlah_tenaga_kerja: latestMap[u.id].jumlah_tenaga_kerja ?? null,
                  halal: latestMap[u.id].halal ?? (u.halal ?? null),
                  pirt: latestMap[u.id].pirt ?? (u.pirt ?? null),
                  haki: latestMap[u.id].haki ?? (u.haki ?? null),
                  nib: latestMap[u.id].nib ?? (u.nib ?? null),
                  instagram: latestMap[u.id].instagram ?? (u.instagram ?? null),
                  facebook: latestMap[u.id].facebook ?? (u.facebook ?? null),
                  tiktok: latestMap[u.id].tiktok ?? (u.tiktok ?? null),
                }
              : {
                  omzet: u.omzet ?? null,
                  jumlah_tenaga_kerja: u.jumlah_tenaga_kerja ?? null,
                  halal: u.halal ?? null,
                  pirt: u.pirt ?? null,
                  haki: u.haki ?? null,
                  nib: u.nib ?? null,
                  instagram: u.instagram ?? null,
                  facebook: u.facebook ?? null,
                  tiktok: u.tiktok ?? null,
                },
            countMap[u.id] ?? 0,
            badgeConfig,
          )).level,
        })),
        avgOmzet: omzetCount > 0 ? Math.round(totalOmzet / omzetCount) : 0,
        badgeCounts,
      },
    });
  } catch (error: any) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
