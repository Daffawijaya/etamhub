import { notFound } from "next/navigation";
import type { Metadata } from "next";

import FooterBrand from "@/components/FooterBrand";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import HeaderNews from "@/components/news/HeaderNews";
import NewsDetail from "@/components/news/NewsDetail";
import NewsSidebar from "@/components/news/NewsSidebar";
import NewsTrending from "@/components/news/NewsTrending";

import {
  getNewsBySlug,
  incrementNewsView,
  getTrendingNews,
} from "@/lib/news/news.service";
import { getBaseUrl } from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const news = await getNewsBySlug(slug);
    const baseUrl = getBaseUrl();
    const canonicalUrl = `${baseUrl}/berita/${news.slug}`;
    const description =
      news.excerpt || stripHtml(news.content).slice(0, 160);
    const imageUrl = news.gambar || undefined;

    return {
      title: news.title,
      description,
      alternates: {
        canonical: `/berita/${news.slug}`,
      },
      openGraph: {
        type: "article",
        title: news.title,
        description,
        url: canonicalUrl,
        siteName: "etamhub",
        locale: "id_ID",
        ...(news.published_at && {
          publishedTime: news.published_at,
        }),
        ...(news.updated_at && {
          modifiedTime: news.updated_at,
        }),
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: news.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description,
        ...(imageUrl && {
          images: [imageUrl],
        }),
      },
    };
  } catch {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Artikel yang Anda cari tidak ditemukan.",
    };
  }
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const news = await getNewsBySlug(slug);

    // Increment view in background (don't block rendering)
    incrementNewsView(news.id).catch(() => {});

    // Fetch trending and sidebar news in parallel
    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
    const [trending, sidebarResult] = await Promise.all([
      getTrendingNews(3),
      supabaseAdmin
        .from("news")
        .select("*")
        .eq("published", true)
        .is("deleted_at", null)
        .neq("id", news.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => data as import("@/types/news").News[] ?? []),
    ]);

    const trendingIds = trending.map((t) => t.id);

    const sidebarNews = sidebarResult
      .filter((item) => !trendingIds.includes(item.id))
      .sort((a, b) => {
        const aRelated = a.category === news.category;
        const bRelated = b.category === news.category;
        if (aRelated !== bRelated) return aRelated ? -1 : 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
      .slice(0, 5);

    const baseUrl = getBaseUrl();
    const description =
      news.excerpt || stripHtml(news.content).slice(0, 160);
    const articleImage = news.gambar || undefined;

    // NewsArticle JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      description,
      image: articleImage ? [articleImage] : undefined,
      datePublished: news.published_at || news.created_at,
      dateModified: news.updated_at || news.created_at,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/berita/${news.slug}`,
      },
      publisher: {
        "@type": "Organization",
        name: "etamhub",
        url: baseUrl,
      },
    };

    // Breadcrumb JSON-LD
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Berita",
          item: `${baseUrl}/berita`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: news.title,
          item: `${baseUrl}/berita/${news.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbLd),
          }}
        />

        <Navbar />

        <main className="overflow-hidden bg-light-bg transition-colors dark:bg-dark">
          <HeaderNews />

          <div
            className="
              relative
              z-40
              mx-auto
              max-w-7xl
              px-4
              pb-24
              pt-30
              sm:px-6
              lg:px-8
            "
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <NewsDetail news={news} />

              <div className="space-y-6">
                <NewsTrending data={trending} currentNewsId={news.id} />

                <NewsSidebar data={sidebarNews} currentNews={news} />
              </div>
            </div>
          </div>

          <Footer />

          <FooterBrand />
        </main>
      </>
    );
  } catch {
    notFound();
  }
}
