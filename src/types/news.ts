export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  gambar: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  view_count: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
