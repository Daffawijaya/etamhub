"use client";

import { useEffect, useState } from "react";

import BadgeProgressCard from "./BadgeProgressCard";
import BusinessInfoCard from "./BusinessInfoCard";
import LegalityCard from "./LegalityCard";
import MonitoringSummaryCard from "./MonitoringSummaryCard";
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

  badge: {
    level: string;
    label: string;
    color: string;
    bgColor: string;
    description: string;
    criteria: {
      omzet: number | null;
      tk: number | null;
      legalitas: number;
      sosmed: number;
      monitoringCount: number;
    };
  };

  criteriaConfig: {
    silver_omzet_min: number;
    silver_tk_min: number;
    silver_legalitas_min: number;
    silver_sosmed_min: number;
    gold_omzet_min: number;
    gold_tk_min: number;
    gold_legalitas_min: number;
    gold_sosmed_min: number;
    platinum_omzet_min: number;
    platinum_tk_min: number;
    platinum_legalitas_min: number;
    platinum_sosmed_min: number;
  };

  monitoring: {
    count: number;
    lastDate: string | null;
    latestData: {
      omzet: number | null;
      jumlah_tenaga_kerja: number | null;
      nib: string | null;
      halal: string | null;
      pirt: string | null;
      haki: string | null;
      instagram: string | null;
      facebook: string | null;
      tiktok: string | null;
    } | null;
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
    <div className="grid grid-cols-12 gap-6">
      {/* Left column */}
      <div className="col-span-8 space-y-6">
        <SummaryCards data={data} />

        <div className="grid grid-cols-2 gap-6">
          <LegalityCard legalitas={data.legalitas} />

          <MonitoringSummaryCard
            monitoring={data.monitoring}
            umkm={data.umkm ? { nama: data.umkm.nama } : null}
          />
        </div>

        <BusinessInfoCard umkm={data.umkm} />
      </div>

      {/* Right column */}
      <div className="col-span-4 space-y-6">
        {data.badge.level !== "none" && (
          <BadgeProgressCard badge={data.badge} criteriaConfig={data.criteriaConfig} />
        )}

        <TimelineCard timeline={data.timeline} />
      </div>
    </div>
  );
}
