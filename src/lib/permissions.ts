import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { CurrentUser } from "@/lib/session";

type PermissionKey = "canCreate" | "canRead" | "canUpdate" | "canDelete";

/**
 * Check if a user has a specific permission based on their role.
 * super_admin always has all permissions.
 */
export async function checkPermission(
  user: CurrentUser,
  permission: PermissionKey,
): Promise<boolean> {
  if (!user) return false;
  if (user.role === "super_admin") return true;

  const { data, error } = await supabaseAdmin
    .from("role_permissions")
    .select("*")
    .eq("role", user.role)
    .maybeSingle();

  if (error || !data) return false;

  const map: Record<PermissionKey, boolean> = {
    canCreate: data.can_create,
    canRead: data.can_read,
    canUpdate: data.can_update,
    canDelete: data.can_delete,
  };

  return map[permission] ?? true;
}

/**
 * Helper to return a 403 response for missing permission.
 */
export function forbiddenResponse(message: string) {
  return new Response(JSON.stringify({ message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}
