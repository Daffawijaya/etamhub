import { NextRequest, NextResponse } from "next/server";

import { deleteNews, getNewsById, updateNews } from "@/lib/news/news.service";
import { getCurrentUser } from "@/lib/session";
import { checkPermission, forbiddenResponse } from "@/lib/permissions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const news = await getNewsById(id);

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Berita tidak ditemukan",
      },
      { status: 404 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check update permission
    const canUpdate = await checkPermission(user, "canUpdate");
    if (!canUpdate) {
      return forbiddenResponse("Anda tidak memiliki izin untuk mengedit data");
    }

    const { id } = await params;

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

    const news = await updateNews(id, {
      title,
      excerpt: typeof excerpt === "string" ? excerpt : null,
      category: typeof category === "string" ? category : null,
      content,
      published: published === "true",
      gambar: gambar instanceof File ? gambar : undefined,
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal update berita",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check delete permission
    const canDelete = await checkPermission(user, "canDelete");
    if (!canDelete) {
      return forbiddenResponse("Anda tidak memiliki izin untuk menghapus data");
    }

    const { id } = await params;

    await deleteNews(id);

    return NextResponse.json({
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal menghapus berita",
      },
      { status: 500 },
    );
  }
}
