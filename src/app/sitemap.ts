import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { KECAMATAN_KUKAR } from "@/app/constants/kecamatanKukar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/peta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Kecamatan pages
  const kecamatanPages: MetadataRoute.Sitemap = KECAMATAN_KUKAR.map(
    (kec) => ({
      url: `${baseUrl}/kecamatan/${kec.toLowerCase().replace(/\s+/g, "-")}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  // Published news
  const { data: news } = await supabaseAdmin
    .from("news")
    .select("slug, updated_at, published_at, created_at")
    .eq("published", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const newsPages: MetadataRoute.Sitemap = (news ?? []).map((item) => ({
    url: `${baseUrl}/berita/${item.slug}`,
    lastModified: new Date(item.updated_at ?? item.published_at ?? item.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Published UMKM
  const { data: umkms } = await supabaseAdmin
    .from("umkm")
    .select("id, updated_at, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const umkmPages: MetadataRoute.Sitemap = (umkms ?? []).map((item) => ({
    url: `${baseUrl}/umkm/${item.id}`,
    lastModified: new Date(item.updated_at ?? item.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Published products
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, updated_at, created_at")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((item) => ({
    url: `${baseUrl}/produk/${item.id}`,
    lastModified: new Date(item.updated_at ?? item.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...kecamatanPages,
    ...newsPages,
    ...umkmPages,
    ...productPages,
  ];
}
