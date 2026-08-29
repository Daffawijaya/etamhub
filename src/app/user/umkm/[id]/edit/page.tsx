import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import UmkmForm from "@/components/form/UmkmForm";
import UserMonitoringHistory from "@/components/user/UserMonitoringHistory";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Merge latest monitoring data into UMKM record.
 * Only fills fields that are null/empty in the UMKM record.
 * This ensures monitoring data auto-populates the "Informasi Usaha" form.
 */
function mergeMonitoringIntoUmkm(umkm: Record<string, any>, latest: Record<string, any>) {
  const merged = { ...umkm };

  // Fields that monitoring can update on the UMKM record
  const syncFields = [
    "jumlah_tenaga_kerja",
    "omzet",
    "nib",
    "halal",
    "pirt",
    "haki",
    "kbli",
    "instagram",
    "facebook",
    "tiktok",
  ];

  for (const field of syncFields) {
    if (
      (merged[field] == null || merged[field] === "" ||
        (Array.isArray(merged[field]) && merged[field].length === 0)) &&
      latest[field] != null
    ) {
      merged[field] = latest[field];
    }
  }

  return merged;
}

export default async function UserEditUmkmPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/");
  }

  const { data: umkm, error } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .eq("owner_id", userId)
    .single();

  if (error || !umkm) {
    redirect("/user/umkm");
  }

  const { data: owner } = await supabaseAdmin
    .from("users")
    .select("email, nik")
    .eq("id", umkm.owner_id)
    .maybeSingle();

  // Fetch latest monitoring entry to auto-fill empty UMKM fields
  const { data: latestMonitoring } = await supabaseAdmin
    .from("umkm_monitoring")
    .select("jumlah_tenaga_kerja, omzet, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok")
    .eq("umkm_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Merge monitoring data into UMKM for empty fields
  const mergedUmkm = latestMonitoring
    ? mergeMonitoringIntoUmkm(umkm, latestMonitoring)
    : umkm;

  return (
    <main className="min-h-screen bg-light px-6 pb-6 dark:bg-dark">
      <UmkmForm
        mode="edit"
        role="user"
        data={{
          ...mergedUmkm,
          email: owner?.email ?? "",
          nik: owner?.nik ?? "",
        }}
      />

      <div className="mt-6">
        <UserMonitoringHistory
          umkmId={umkm.id}
          umkm={{
            jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
            omzet: umkm.omzet ?? null,
            nib: umkm.nib ?? null,
            halal: umkm.halal ?? null,
            pirt: umkm.pirt ?? null,
            haki: umkm.haki ?? null,
            kbli: umkm.kbli ?? null,
            instagram: umkm.instagram ?? null,
            facebook: umkm.facebook ?? null,
            tiktok: umkm.tiktok ?? null,
          }}
        />
      </div>
    </main>
  );
}
