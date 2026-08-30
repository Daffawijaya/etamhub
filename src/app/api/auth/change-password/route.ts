import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Password lama dan password baru wajib diisi" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password baru minimal 8 karakter" },
        { status: 400 },
      );
    }

    // Determine table based on role
    const isAdmin =
      role === "admin" || role === "super_admin" || role === "admin_kecamatan";
    const table = isAdmin ? "admins" : "users";

    // Get current password hash
    const { data: record, error: fetchError } = await supabaseAdmin
      .from(table)
      .select("password")
      .eq("id", userId)
      .single();

    if (fetchError || !record) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan" },
        { status: 404 },
      );
    }

    // Verify current password
    const isHashed = record.password.startsWith("$2");
    const isValid = isHashed
      ? await bcrypt.compare(currentPassword, record.password)
      : currentPassword === record.password;

    if (!isValid) {
      return NextResponse.json(
        { message: "Password lama salah" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update({ password: hashedPassword })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error: any) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
