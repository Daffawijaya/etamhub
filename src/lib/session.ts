import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return null;
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select(
      `
      id,
      nama,
      username,
      nik,
      role_id,
      roles (
        name
      ),
      user_kecamatan (
        kecamatan_id,
        kecamatan (
          id,
          nama
        )
      )
      `,
    )
    .eq("id", userId)
    .single();

  if (error || !user) {
    console.error(error);
    return null;
  }

  return {
    id: user.id,
    nama: user.nama,
    username: user.username,
    nik: user.nik,

    role: Array.isArray(user.roles)
      ? (user.roles[0] as { name: string })?.name
      : (user.roles as { name: string })?.name,

    roleId: user.role_id,

    kecamatanIds: user.user_kecamatan?.map((item) => item.kecamatan_id) || [],

    kecamatan: user.user_kecamatan?.map((item) => item.kecamatan) || [],
  };
}
