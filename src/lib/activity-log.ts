import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface LogActivityParams {
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId?: string;
  targetName?: string;
  detail?: Record<string, any>;
}

/**
 * Log aktivitas admin/admin kecamatan ke tabel activity_logs.
 * Dipanggil dari API route setelah action berhasil.
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const { error } = await supabaseAdmin.from("activity_logs").insert({
      id: crypto.randomUUID(),
      actor_id: params.actorId,
      actor_name: params.actorName,
      actor_role: params.actorRole,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId ?? null,
      target_name: params.targetName ?? null,
      detail: params.detail ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("LOG ACTIVITY ERROR:", error);
    }
  } catch (err) {
    console.error("LOG ACTIVITY FAILED:", err);
  }
}
