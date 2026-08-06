"use client";

import { useEffect, useState } from "react";

import BusinessInfoCard from "./BusinessInfoCard";
import LegalityCard from "./LegalityCard";
import SummaryCards from "./SummaryCards";
import TimelineCard from "./TimelineCard";

type DashboardData = {
  profile: {
    id: string;
    nik: string;
    email: string;
    role: string;
  };

  umkm: {
    id: string;
    nama: string;
    pemilik: string;
    kategori: string;
    subkategori: string;
    deskripsi: string;
    kecamatan: string;
    alamat: string;
    whatsapp: string;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    gambar_count: number;
  } | null;

  status: {
    approval_status: string | null;
    approval_label: string;
    published: boolean;
  };

  completeness: {
    percentage: number;
    filled: number;
    total: number;
  };

  legalitas: {
    nib: boolean;
    npwp: boolean;
    halal: boolean;
    pirt: boolean;
    haki: boolean;
    kbli: boolean;
  };

  timeline: {
    title: string;
    date: string;
    status: string;
    reason?: string;
  }[];
};
export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/user/dashboard", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center dark:bg-dark-card">
        <p className="text-sm text-gray-500">Memuat dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center dark:bg-dark-card">
        <p className="text-sm text-red-500">Gagal memuat data dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards data={data} />

      <LegalityCard legalitas={data.legalitas} />

      <div className="grid gap-6 xl:grid-cols-2">
        <BusinessInfoCard umkm={data.umkm} />

        <TimelineCard timeline={data.timeline} />
      </div>
    </div>
  );
}
