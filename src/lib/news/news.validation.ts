import type { News } from "@/types/news";

type NewsValidationInput = Pick<Partial<News>, "title" | "content">;

export function validateNews(payload: NewsValidationInput) {
  if (!payload.title?.trim()) {
    return "Judul berita wajib diisi.";
  }

  if (!payload.content?.trim()) {
    return "Isi berita wajib diisi.";
  }

  return null;
}
