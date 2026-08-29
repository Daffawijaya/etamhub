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

  return (
    <main className="min-h-screen bg-light px-6 pb-6 dark:bg-dark">
      <UmkmForm
        mode="edit"
        role="user"
        data={{
          ...umkm,
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
