import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_ROLES = ["admin", "admin_kecamatan"] as const;

async function ensureDefaults() {
  for (const role of ALLOWED_ROLES) {
    const { data } = await supabaseAdmin.from("role_permissions").select("id").eq("role", role).maybeSingle();
    if (!data) {
      await supabaseAdmin.from("role_permissions").insert({ role, can_create: true, can_read: true, can_update: true, can_delete: true });
    }
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    await ensureDefaults();
    const { data, error } = await supabaseAdmin.from("role_permissions").select("*").in("role", [...ALLOWED_ROLES]).order("role");
    if (error) throw error;
    const mapped = (data ?? []).map((r: any) => ({
      role: r.role,
      canCreate: r.can_create,
      canRead: r.can_read,
      canUpdate: r.can_update,
      canDelete: r.can_delete,
    }));
    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const body = await req.json();
    const { role, canCreate, canRead, canUpdate, canDelete } = body as {
      role: string;
      canCreate?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
    };
    if (!role || !ALLOWED_ROLES.includes(role as any)) {
      return NextResponse.json({ message: "Role tidak valid" }, { status: 400 });
    }
    const payload: Record<string, any> = {};
    if (typeof canCreate === "boolean") payload.can_create = canCreate;
    if (typeof canRead === "boolean") payload.can_read = canRead;
    if (typeof canUpdate === "boolean") payload.can_update = canUpdate;
    if (typeof canDelete === "boolean") payload.can_delete = canDelete;

    const { data, error } = await supabaseAdmin
      .from("role_permissions")
      .update(payload)
      .eq("role", role)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({
      role: data.role,
      canCreate: data.can_create,
      canRead: data.can_read,
      canUpdate: data.can_update,
      canDelete: data.can_delete,
    });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
