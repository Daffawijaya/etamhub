import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.alodokter.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "zxodumrqlljawnafnrup.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mmc.kotawaringinbaratkab.go.id",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "p16-oec-sg.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "img.lazcdn.com",
      },
      {
        protocol: "https",
        hostname: "www.static-src.com",
      },
      {
        protocol: "https",
        hostname: "cdn1.katadata.co.id",
      },
      {
        protocol: "https",
        hostname: "smexpo.pertamina.com",
      },
      {
        protocol: "https",
        hostname: "cdn.digitaldesa.com",
      },
      {
        protocol: "https",
        hostname: "www.kutairaya.com",
      },
      {
        protocol: "https",
        hostname: "diskopukm.kukarkab.go.id",
      },
      {
        protocol: "https",
        hostname: "down-id.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "lelogama.go-jek.com",
      },
      {
        protocol: "https",
        hostname: "kaltimtoday.co",
      },
      {
        protocol: "https",
        hostname: "indonesiakaya.com",
      },
    ],
  },
};

export default nextConfig;
