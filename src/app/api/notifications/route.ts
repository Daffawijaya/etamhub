import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("NOTIFICATION ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(data ?? []);
}
