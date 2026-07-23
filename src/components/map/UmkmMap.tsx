"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/data/umkm";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
});

interface Props {
  umkms: Umkm[];
}

export default function UmkmMap({ umkms }: Props) {
  return <MapClient umkms={umkms} />;
}
