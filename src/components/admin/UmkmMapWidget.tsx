"use client";

import dynamic from "next/dynamic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const MapWidget = dynamic(() => import("@/components/map/MapWidget"), {
  ssr: false,
});

export default function UmkmMapWidget() {
  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold pt-4">
          Peta Sebaran UMKM
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[335px]">
          <MapWidget />
        </div>
      </CardContent>
    </Card>
  );
}