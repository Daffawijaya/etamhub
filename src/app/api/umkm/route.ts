import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normalizeWhatsapp(phone?: string) {
  if (!phone) return "";

  let value = phone.replace(/\D/g, "");

  if (value.startsWith("62")) {
    value = "0" + value.slice(2);
  } else if (value.startsWith("8")) {
    value = "0" + value;
  }

  return value;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET UMKM ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.whatsapp = normalizeWhatsapp(body.whatsapp);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("umkm")
      .insert({
        id: crypto.randomUUID(),
        ...body,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("notifications").insert({
      id: crypto.randomUUID(),
      type: "create",
      title: `Menambahkan UMKM ${data.nama}`,
      created_at: now,
      read: false,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("POST UMKM ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
