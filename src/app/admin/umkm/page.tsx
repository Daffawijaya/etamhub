"use client";

import UmkmDataTable from "@/components/admin/umkm/UmkmDataTable";
import umkms from "@/data/umkm.json";

export default function UmkmPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-0 bg-white shadow-sm">
        <UmkmDataTable data={umkms} />
      </div>
    </div>
  );
}
