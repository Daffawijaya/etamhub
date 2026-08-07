import sharp from "sharp";

import { supabaseAdmin } from "../supabaseAdmin";
import type { News } from "@/types/news";
import { validateNews } from "./news.validation";
import { generateSlug } from "./news.utils";

type NewsInput = Omit<Partial<News>, "gambar"> & {
  gambar?: File | null;
};

async function uploadNewsImage(file: File) {
  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = `news/${fileName}`;

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const webpBuffer = await sharp(inputBuffer)
    .rotate()
    .resize({
      width: 1920,
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      effort: 6,
    })
    .toBuffer();

  const uploadData = new Uint8Array(webpBuffer);

  const { error } = await supabaseAdmin.storage
    .from("news-images")
    .upload(filePath, uploadData, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload gambar: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from("news-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function deleteNewsImage(publicUrl: string | null) {
  if (!publicUrl) {
    return;
  }

  const marker = "/storage/v1/object/public/news-images/";

  const index = publicUrl.indexOf(marker);

  if (index === -1) {
    return;
  }

  const filePath = publicUrl.slice(index + marker.length);

  const { error } = await supabaseAdmin.storage
    .from("news-images")
    .remove([filePath]);

  if (error) {
    throw new Error(`Gagal menghapus gambar lama: ${error.message}`);
  }
}

type GetNewsParams = {
  search?: string;
  page?: number;
  limit?: number;
  excludeIds?: string[];
  published?: boolean;
};

export async function getNews({
  search = "",
  page = 1,
  limit = 10,
  published,
  excludeIds = [],
}: GetNewsParams = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("news")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  const keyword = search.trim();

  if (keyword) {
    const escapedKeyword = keyword.replace(/[%_]/g, "\\$&");

    query = query.or(
      `title.ilike.%${escapedKeyword}%,category.ilike.%${escapedKeyword}%,excerpt.ilike.%${escapedKeyword}%`,
    );
  }

  if (published !== undefined) {
    query = query.eq("published", published);
  }

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error, count } = await query
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data as News[],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as News;
}

export async function getNewsById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as News;
}

export async function createNews(payload: NewsInput) {
  const validation = validateNews(payload);

  if (validation) {
    throw new Error(validation);
  }

  let gambarUrl: string | null = null;

  if (payload.gambar instanceof File && payload.gambar.size > 0) {
    gambarUrl = await uploadNewsImage(payload.gambar);
  }

  const isPublished = payload.published === true;

  const newsPayload = {
    title: payload.title,
    slug: payload.slug || generateSlug(payload.title!),
    excerpt: payload.excerpt ?? null,
    content: payload.content,
    gambar: gambarUrl,
    category: payload.category ?? null,
    published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    author_id: payload.author_id ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from("news")
    .insert(newsPayload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as News;
}

export async function updateNews(id: string, payload: NewsInput) {
  const existingNews = await getNewsById(id);

  const validation = validateNews(payload);

  if (validation) {
    throw new Error(validation);
  }

  let gambarUrl = existingNews.gambar;

  if (payload.gambar instanceof File && payload.gambar.size > 0) {
    const newgambarUrl = await uploadNewsImage(payload.gambar);

    if (existingNews.gambar) {
      await deleteNewsImage(existingNews.gambar);
    }

    gambarUrl = newgambarUrl;
  }

  const isPublished = payload.published === true;

  const publishedAt = isPublished
    ? (existingNews.published_at ?? new Date().toISOString())
    : null;

  const newsPayload = {
    title: payload.title,
    slug: payload.slug || existingNews.slug,
    excerpt: payload.excerpt ?? null,
    content: payload.content,
    gambar: gambarUrl,
    category: payload.category ?? null,
    published: isPublished,
    published_at: publishedAt,
  };

  const { data, error } = await supabaseAdmin
    .from("news")
    .update(newsPayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as News;
}

export async function deleteNews(id: string) {
  const existingNews = await getNewsById(id);

  if (existingNews.gambar) {
    await deleteNewsImage(existingNews.gambar);
  }

  const { error } = await supabaseAdmin
    .from("news")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function incrementNewsView(id: string) {
  const { error } = await supabaseAdmin.rpc("increment_news_view", {
    news_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getTrendingNews(limit = 3) {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .eq("published", true)
    .is("deleted_at", null)
    .order("view_count", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data as News[];
}
