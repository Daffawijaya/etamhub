import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EtamHub",
  description: "Katalog UMKM Kutai Kartanegara",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${outfit.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
