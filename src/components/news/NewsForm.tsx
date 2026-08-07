"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { NEWS_CATEGORIES } from "@/data/news";

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

  const hasChanges = initialData
    ? title !== (initialData.title ?? "") ||
      excerpt !== (initialData.excerpt ?? "") ||
      category !== (initialData.category ?? "") ||
      content !== (initialData.content ?? "") ||
      published !== (initialData.published ?? false) ||
      gambar !== null
    : true;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (initialData && !hasChanges) {
      return;
    }

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
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          {initialData ? "Edit Berita" : "Tambah Berita"}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {initialData
            ? "Kelola dan perbarui data berita."
            : "Tambahkan berita baru ke EtamHub."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Judul
          </label>

          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul berita"
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-primary
              dark:border-slate-800
              dark:bg-dark
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Ringkasan
          </label>

          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            required
            placeholder="Masukkan ringkasan berita"
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-primary
              dark:border-slate-800
              dark:bg-dark
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Kategori
          </label>

          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-primary
              dark:border-slate-800
              dark:bg-dark
              dark:text-white
            "
          >
            <option value="" disabled>
              Pilih kategori berita
            </option>

            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Gambar
          </label>

          <input
            name="gambar"
            type="file"
            required={!initialData?.gambar}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setGambar(e.target.files?.[0] ?? null);
            }}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              file:mr-4
              file:rounded-lg
              file:border-0
              file:bg-primary
              file:px-4
              file:py-2
              file:text-sm
              file:font-medium
              file:text-white
              focus:border-primary
              dark:border-slate-800
              dark:bg-dark
              dark:text-white
            "
          />

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {initialData?.gambar
              ? "Kosongkan jika tidak ingin mengganti gambar. JPG, PNG, atau WebP. Gambar otomatis dikonversi ke WebP."
              : "Maksimal 1 gambar. JPG, PNG, atau WebP. Gambar otomatis dikonversi ke WebP."}
          </p>

          {initialData?.gambar && !gambar && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Gambar saat ini
              </p>

              <img
                src={initialData.gambar}
                alt="Gambar berita saat ini"
                className="h-40 w-64 rounded-xl object-cover"
              />
            </div>
          )}

          {gambar && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Preview gambar baru
              </p>

              <img
                src={URL.createObjectURL(gambar)}
                alt="Preview gambar baru"
                className="h-40 w-64 rounded-xl object-cover"
              />

              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {gambar.name}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Isi Berita
          </label>

          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Masukkan isi berita"
            required
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-primary
              dark:border-slate-800
              dark:bg-dark
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            required
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />

          <span>Publikasikan berita</span>
        </label>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
          <button
            type="submit"
            disabled={loading || (!!initialData && !hasChanges)}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-all
              duration-200
              hover:bg-emerald-700
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
              focus:ring-offset-2
              focus:ring-offset-white
              dark:bg-emerald-500
              dark:hover:bg-emerald-400
              dark:focus:ring-emerald-400
              dark:focus:ring-offset-slate-900
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              disabled:text-slate-500
              dark:disabled:bg-slate-800
              dark:disabled:text-slate-500
            "
          >
            {loading
              ? "Menyimpan..."
              : initialData
                ? "Update Berita"
                : "Simpan Berita"}
          </button>
        </div>
      </form>
    </div>
  );
}
