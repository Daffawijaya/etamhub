import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Providers from "./provider";
import ScrollTop from "@/components/ScrollTop";
import "leaflet/dist/leaflet.css";
import TopLoader from "@/components/TopLoader";
import GlobalLoader from "@/components/GlobalLoader";
import { ModalProvider } from "@/components/ui/modal";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "etamhub",
  description: "Katalog UMKM Kutai Kartanegara",
  icons: {
    icon: "/eiconl.png",
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
            <ScrollTop />
            {children}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
