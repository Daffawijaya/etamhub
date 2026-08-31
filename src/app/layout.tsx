import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Providers from "./provider";
import ScrollTop from "@/components/ScrollTop";
import TopLoader from "@/components/TopLoader";
import GlobalLoader from "@/components/GlobalLoader";
import { ModalProvider } from "@/components/ui/modal";
import SessionExpiryChecker from "@/components/SessionExpiryChecker";
import { getBaseUrl } from "@/lib/api";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "etamhub — Katalog UMKM Kutai Kartanegara",
    template: "%s | etamhub",
  },
  description:
    "etamhub adalah platform katalog UMKM Kutai Kartanegara. Temukan produk, layanan, dan informasi UMKM dari seluruh kecamatan.",
  icons: {
    icon: "/eiconl.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "etamhub",
    title: "etamhub — Katalog UMKM Kutai Kartanegara",
    description:
      "Platform katalog UMKM Kutai Kartanegara. Temukan produk, layanan, dan informasi UMKM dari seluruh kecamatan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "etamhub — Katalog UMKM Kutai Kartanegara",
    description:
      "Platform katalog UMKM Kutai Kartanegara. Temukan produk, layanan, dan informasi UMKM dari seluruh kecamatan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-full flex flex-col`}>
        <TopLoader />
        <GlobalLoader />

        <Providers>
          <ModalProvider>
            <SessionExpiryChecker />
            <ScrollTop />
            {children}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
