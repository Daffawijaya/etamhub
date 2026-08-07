"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import type { News } from "@/types/news";

type Props = {
  initialData?: News;
};

export default function NewsForm({ initialData }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [gambar, setGambar] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("published", String(published));

      if (gambar) {
        formData.append("gambar", gambar);
      }

      const url = initialData ? `/api/news/${initialData.id}` : "/api/news";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan.");
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan berita.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block font-medium">Judul</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Masukkan judul berita"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Ringkasan</label>

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border p-3"
          placeholder="Masukkan ringkasan berita"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Kategori</label>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Masukkan kategori berita"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Gambar</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            setGambar(e.target.files?.[0] ?? null);
          }}
          className="w-full rounded-lg border p-3"
        />

        <p className="mt-2 text-xs text-gray-500">
          Maksimal 1 gambar. JPG, PNG, atau WebP. Gambar akan otomatis
          dikonversi ke WebP.
        </p>

        {initialData?.gambar && !gambar && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Gambar saat ini sudah tersedia.
            </p>

            <img
              src={initialData.gambar}
              alt="gambar saat ini"
              className="mt-2 h-32 w-52 rounded-lg object-cover"
            />
          </div>
        )}

        {gambar && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">{gambar.name}</p>

            <img
              src={URL.createObjectURL(gambar)}
              alt="Preview gambar"
              className="mt-2 h-32 w-52 rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">Isi Berita</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full rounded-lg border p-3"
          placeholder="Masukkan isi berita"
          required
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />

        <span>Publikasikan</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Menyimpan..."
          : initialData
            ? "Update Berita"
            : "Simpan Berita"}
      </button>
    </form>
  );
}
