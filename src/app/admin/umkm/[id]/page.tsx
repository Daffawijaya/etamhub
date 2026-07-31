import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import UmkmDetail from "@/components/admin/umkm/UmkmDetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  if (data.owner_id) {
    const { data: owner } = await supabaseAdmin
      .from("users")
      .select("email, nik")
      .eq("id", data.owner_id)
      .maybeSingle();

    if (owner) {
      data.email = owner.email;
      data.nik = owner.nik;
    }
  }

  return <UmkmDetail data={data} />;
}
