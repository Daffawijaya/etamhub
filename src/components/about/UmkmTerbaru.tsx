import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import SectionHeader from "../textBlock/SectionHeader";
import ExploreButton from "../button/ExploreButton";
import UmkmCard from "../district/UmkmCard";
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

  return (
    <section
      id="terbaru"
      className="
        bg-light-bg
        dark:bg-dark
        py-8
        sm:py-10
        md:py-16
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <SectionHeader
          title="UMKM Terbaru"
          description="Pelaku usaha yang baru bergabung dan memperkenalkan produk serta layanannya melalui etamhub."
        />

        <div
          className="
            mt-10
            sm:mt-12
            md:mt-20
            grid
            grid-cols-2
            xl:grid-cols-4
            gap-3
            sm:gap-5
            md:gap-6
          "
        >
          {umkms.map((umkm) => (
            <UmkmCard
              key={umkm.id}
              id={umkm.id}
              nama={umkm.nama}
              subkategori={umkm.subkategori}
              deskripsi={umkm.deskripsi}
              gambar={umkm.gambar}
              badge={badges[umkm.id] ?? null}
            />
          ))}
        </div>

        <div className="w-full pt-12 flex justify-center">
          <ExploreButton />
        </div>
      </div>
    </section>
  );
}
