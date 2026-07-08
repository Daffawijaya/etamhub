import "./globals.css";
import type { Metadata } from "next";
import { montserrat, coiny } from "@/lib/fonts";

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
      <body
        className={`${montserrat.className} ${montserrat.variable} ${coiny.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
