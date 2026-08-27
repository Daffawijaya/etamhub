import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type CurrentUser = {
  id: string;
  nama: string | null;
  username: string | null;
  nik: string | null;
  email: string | null;
  role: string | null;
  roleId: string | null;
  kecamatanIds: string[];
  kecamatan: string[];
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
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

    const resolvedRole: string | null =
      cookieRole ??
      (Array.isArray(roleData) ? roleData[0]?.name : roleData?.name) ?? null;

    let kecamatanIds: string[] = [];
    let kecamatan: string[] = [];

    if (resolvedRole === "admin_kecamatan") {
      const { data: kecRel } = await supabaseAdmin
        .from("admin_kecamatan_kecamatan")
        .select("kecamatan_id")
        .eq("admin_id", admin.id);

      if (kecRel && kecRel.length > 0) {
        kecamatanIds = kecRel.map((r) => r.kecamatan_id);

        const { data: kecData } = await supabaseAdmin
          .from("kecamatan")
          .select("id, nama")
          .in("id", kecamatanIds);

        kecamatan = (kecData ?? []).map((k) => k.nama);
      }
    }

    return {
      id: admin.id,
      nama: admin.nama,
      username: admin.username,
      nik: null,
      email: null,

      role: resolvedRole,

      roleId: admin.role_id,

      kecamatanIds,
      kecamatan,
    };
  }

  return null;
}
