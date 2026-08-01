import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;
  const cookieRole = cookieStore.get("role")?.value;

  if (!userId) {
    return null;
  }

  // =========================
  // CEK USERS
  // =========================
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (user) {
    return {
      id: user.id,
      nama: user.nama ?? null,
      username: null,
      nik: user.nik ?? null,
      email: user.email ?? null,

      role: cookieRole ?? "user",

      roleId: null,

      kecamatanIds: [],
      kecamatan: [],
    };
  }

  // =========================
  // CEK ADMINS (SUPER ADMIN)
  // =========================
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select(
      `
      id,
      nama,
      username,
      role_id,
      roles (
        name
      )
    `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (admin) {
    const roleData = admin.roles as
      | { name: string }
      | { name: string }[]
      | null;

    return {
      id: admin.id,
      nama: admin.nama,
      username: admin.username,
      nik: null,
      email: null,

      role:
        cookieRole ??
        (Array.isArray(roleData) ? roleData[0]?.name : roleData?.name),

      roleId: admin.role_id,

      kecamatanIds: [],
      kecamatan: [],
    };
  }

  return null;
}
