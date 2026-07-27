import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UmkmDetail from "@/components/admin/umkm/UmkmDetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <UmkmDetail data={data} />;
}
