import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import UmkmTerbaruAnimated from "./UmkmTerbaruAnimated";
import { calculateBadgeWithCriteria, getBadgeCriteria } from "@/lib/monitoring/badges";

export default async function UmkmTerbaruSection() {
  let { data: latestUmkms, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("published", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(4);

  if (error) {
    const fallback = await supabase
      .from("umkm")
      .select("*")
      .order("id", {
        ascending: false,
      })
      .limit(4);

    latestUmkms = fallback.data;
    error = fallback.error;
  }

  if (error) {
    throw new Error(error.message);
  }

  const umkms = latestUmkms ?? [];
  const umkmIds = umkms.map((u) => u.id);

  // Fetch badges
  let badges: Record<string, any> = {};
  if (umkmIds.length > 0) {
    const criteriaConfig = await getBadgeCriteria();

    const { data: monitoringCounts } = await supabaseAdmin
      .from("umkm_monitoring")
      .select("umkm_id")
      .in("umkm_id", umkmIds);

    const countMap: Record<string, number> = {};
    (monitoringCounts ?? []).forEach((m) => {
      countMap[m.umkm_id] = (countMap[m.umkm_id] || 0) + 1;
    });

    const umkmsWithMonitoring = Object.keys(countMap);
    if (umkmsWithMonitoring.length > 0) {
      const { data: latestMonitorings } = await supabaseAdmin
        .from("umkm_monitoring")
        .select("umkm_id, jumlah_tenaga_kerja, omzet, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok")
        .in("umkm_id", umkmsWithMonitoring)
        .order("created_at", { ascending: false });

      const latestMap: Record<string, any> = {};
      (latestMonitorings ?? []).forEach((m) => {
        if (!latestMap[m.umkm_id]) latestMap[m.umkm_id] = m;
      });

      for (const umkm of umkms) {
        const count = countMap[umkm.id] || 0;
        const latestEntry = latestMap[umkm.id];
        if (latestEntry) {
          // Merge UMKM data with monitoring (monitoring takes priority, fallback to UMKM)
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

  return <UmkmTerbaruAnimated umkms={umkms as any} badges={badges as any} />;
}
