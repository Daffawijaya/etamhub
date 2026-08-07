import { NextRequest, NextResponse } from "next/server";

import { createNews, getNews } from "@/lib/news/news.service";

export async function GET() {
  try {
    const news = await getNews();

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal mengambil berita",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const category = formData.get("category");
    const content = formData.get("content");
    const published = formData.get("published");
    const gambar = formData.get("gambar");

    if (typeof title !== "string" || typeof content !== "string") {
      return NextResponse.json(
        {
          message: "Judul dan isi berita wajib diisi.",
        },
        { status: 400 },
      );
    }

    const news = await createNews({
      title,
      excerpt: typeof excerpt === "string" ? excerpt : null,
      category: typeof category === "string" ? category : null,
      content,
      published: published === "true",
      gambar: gambar instanceof File ? gambar : null,
    });

    return NextResponse.json(news, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal membuat berita",
      },
      { status: 500 },
    );
  }
}
