import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Providers from "./provider";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EtamHub",
  description: "Katalog UMKM Kutai Kartanegara",
  icons: {
    icon: "/eicon2.png",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}