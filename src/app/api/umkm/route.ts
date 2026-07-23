import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

const notificationPath = path.join(
  process.cwd(),
  "src/data/notifications.json",
);

// GET semua UMKM
export async function GET() {
  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(data);
}

// TAMBAH UMKM
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const now = new Date().toISOString();

    const newUmkm = {
      id: crypto.randomUUID(),
      ...body,
      created_at: now,
      updated_at: now,
    };

    // =========================
    // Insert Supabase
    // =========================
    const { data, error } = await supabase
      .from("umkm")
      .insert(newUmkm)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // =========================
    // Notifikasi
    // =========================
    const notificationFile = await fs.readFile(notificationPath, "utf-8");

    const notifications = JSON.parse(notificationFile);

    notifications.unshift({
      id: crypto.randomUUID(),
      type: "create",
      title: `Tambah UMKM ${data.nama}`,
      createdAt: now,
      read: false,
    });

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const filteredNotifications = notifications.filter((item: any) => {
      return Date.now() - new Date(item.createdAt).getTime() <= THIRTY_DAYS;
    });

    await fs.writeFile(
      notificationPath,
      JSON.stringify(filteredNotifications, null, 2),
      "utf-8",
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error(error);

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
