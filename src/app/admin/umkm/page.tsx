"use client";

import { Card, CardContent } from "@/components/ui/card";
import UmkmDataTable from "@/components/admin/umkm/UmkmDataTable";
import umkms from "@/data/umkm.json";

export default function UmkmPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <UmkmDataTable data={umkms} />
        </CardContent>
      </Card>
    </div>
  );
}
