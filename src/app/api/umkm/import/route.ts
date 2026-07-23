import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .order("createdAt", {
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


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const now = new Date().toISOString();

    const newUmkm = {
      id: crypto.randomUUID(),

      ...body,

      createdAt: now,
      updatedAt: now,
    };


    const { data, error } = await supabase
      .from("umkm")
      .insert(newUmkm)
      .select()
      .single();


    if (error) {
      throw error;
    }


    await supabase
      .from("notifications")
      .insert({
        id: crypto.randomUUID(),
        type: "create",
        title: `Tambah UMKM ${newUmkm.nama}`,
        createdAt: now,
        read: false,
      });


    return NextResponse.json({
      success: true,
      data,
    });


  } catch (error:any) {

    return NextResponse.json(
      {
        message:error.message,
      },
      {
        status:500,
      },
    );

  }
}