import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import UmkmForm from "@/components/form/UmkmForm";

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

  return (
    <main className="min-h-screen bg-light px-6 pb-6 dark:bg-dark">
      <UmkmForm mode="edit" data={umkm} role="user" />
    </main>
  );
}
