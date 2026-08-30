"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { Plus, TrendingUp, TrendingDown, Minus, ArrowRight, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import KBLISelect from "@/components/form/ui/KBLISelect";

interface UmkmData {
  id: string;
  nama: string;
  pemilik: string | null;
  kategori: string;
  kecamatan: string;
  alamat: string | null;
  jumlah_tenaga_kerja: number | null;
  omzet: number | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  nib: string | null;
  kbli: string[] | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

interface MonitoringEntry {
  id: string;
  created_at: string;
  jumlah_tenaga_kerja: number | null;
  omzet: number | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  nib: string | null;
  kbli: string[] | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  kebutuhan_utama: string | null;
  catatan: string | null;
}

interface Badge {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
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
}

interface CriteriaConfig {
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
}

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bronze: <SeedlingIcon className="h-5 w-5" />,
  silver: <SilverMedalIcon className="h-5 w-5" />,
  gold: <GoldMedalIcon className="h-5 w-5" />,
  platinum: <DiamondIcon className="h-5 w-5" />,
};

const BADGE_RING_COLORS: Record<string, string> = {
  bronze: "ring-amber-300 dark:ring-amber-600",
  silver: "ring-emerald-300 dark:ring-emerald-600",
  gold: "ring-orange-300 dark:ring-orange-600",
  platinum: "ring-purple-300 dark:ring-purple-600",
};

function ProgressBar({
  current,
  target,
  label,
  format = "number",
}: {
  current: number;
  target: number;
  label: string;
  format?: "number" | "rupiah";
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const met = current >= target;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`font-medium ${met ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}>
          {format === "rupiah" ? formatRupiah(current) : current}
          {!met && (
            <span className="text-slate-400 dark:text-slate-500">
              {" / "}
              {format === "rupiah" ? formatRupiah(target) : target}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            met
              ? "bg-green-500"
              : pct > 50
                ? "bg-amber-500"
                : "bg-slate-300 dark:bg-slate-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TrendBadge({
  current,
  previous,
  format = "number",
}: {
  current: number | null;
  previous: number | null;
  format?: "number" | "rupiah";
}) {
  const curr = current ?? 0;
  const prev = previous ?? 0;
  const diff = curr - prev;

  if (prev === 0 && curr === 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        diff > 0
          ? "text-green-600 dark:text-green-400"
          : diff < 0
            ? "text-red-600 dark:text-red-400"
            : "text-slate-400"
      }`}
    >
      {diff > 0 ? <TrendingUp size={10} /> : diff < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
      {format === "rupiah" ? formatRupiah(Math.abs(diff)) : Math.abs(diff)}
    </span>
  );
}

export default function MonitoringDetailPage() {
  const params = useParams();
  const umkmId = params.umkmId as string;

  const [umkm, setUmkm] = useState<UmkmData | null>(null);
  const [monitorings, setMonitorings] = useState<MonitoringEntry[]>([]);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [criteriaConfig, setCriteriaConfig] = useState<CriteriaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const [form, setForm] = useState({
    jumlah_tenaga_kerja: "",
    omzet: "",
    halal: "",
    pirt: "",
    haki: "",
    nib: "",
    kbli: [] as string[],
    instagram: "",
    facebook: "",
    tiktok: "",
    kebutuhan_utama: "",
    catatan: "",
  });

  async function loadData() {
    try {
      const res = await fetch(`/api/admin/monitoring/${umkmId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUmkm(data.umkm);
      setMonitorings(data.monitorings ?? []);
      setBadge(data.badge ?? null);
      setCriteriaConfig(data.criteriaConfig ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [umkmId]);

  async function handleAddMonitoring() {
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      if (form.jumlah_tenaga_kerja) payload.jumlah_tenaga_kerja = Number(form.jumlah_tenaga_kerja);
      if (form.omzet) payload.omzet = Number(form.omzet);
      payload.halal = form.halal || null;
      payload.pirt = form.pirt || null;
      payload.haki = form.haki || null;
      payload.nib = form.nib || null;
      if (form.kbli.length > 0) payload.kbli = form.kbli;
      payload.instagram = form.instagram || null;
      payload.facebook = form.facebook || null;
      payload.tiktok = form.tiktok || null;
      if (form.kebutuhan_utama) payload.kebutuhan_utama = form.kebutuhan_utama;
      if (form.catatan) payload.catatan = form.catatan;

      const res = await fetch(`/api/admin/monitoring/${umkmId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setShowForm(false);
      setForm({
        jumlah_tenaga_kerja: "",
        omzet: "",
        halal: "",
        pirt: "",
        haki: "",
        nib: "",
        kbli: [],
        instagram: "",
        facebook: "",
        tiktok: "",
        kebutuhan_utama: "",
        catatan: "",
      });
      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;
  if (!umkm) return <div className="p-6 text-center text-slate-500">UMKM tidak ditemukan</div>;

  const latest = monitorings[0] ?? null;

  // Merge monitoring entry with UMKM data (fallback)
  // eslint-disable-next-line
  const _umkm = umkm!;
  function getEntryData(entry: MonitoringEntry | null) {
    if (!entry) {
      return { omzet: _umkm.omzet, jumlah_tenaga_kerja: _umkm.jumlah_tenaga_kerja, halal: _umkm.halal, pirt: _umkm.pirt, haki: _umkm.haki, nib: _umkm.nib, instagram: _umkm.instagram, facebook: _umkm.facebook, tiktok: _umkm.tiktok };
    }
    return {
      omzet: entry.omzet ?? _umkm.omzet,
      jumlah_tenaga_kerja: entry.jumlah_tenaga_kerja ?? _umkm.jumlah_tenaga_kerja,
      halal: entry.halal ?? _umkm.halal,
      pirt: entry.pirt ?? _umkm.pirt,
      haki: entry.haki ?? _umkm.haki,
      nib: entry.nib ?? _umkm.nib,
      instagram: entry.instagram ?? _umkm.instagram,
      facebook: entry.facebook ?? _umkm.facebook,
      tiktok: entry.tiktok ?? _umkm.tiktok,
    };
  }

  const latestData = getEntryData(latest);

  const legalItems = [
    latestData.nib && { label: "NIB", value: latestData.nib },
    umkm.kbli && umkm.kbli.length > 0 && { label: "KBLI", value: umkm.kbli.join(", ") },
    latestData.halal && { label: "Halal", value: latestData.halal },
    latestData.pirt && { label: "PIRT", value: latestData.pirt },
    latestData.haki && { label: "HAKI", value: latestData.haki },
  ].filter(Boolean) as { label: string; value: string }[];

  const sosmedItems = [
    latestData.instagram && { label: "Instagram", value: latestData.instagram },
    latestData.facebook && { label: "Facebook", value: latestData.facebook },
    latestData.tiktok && { label: "TikTok", value: latestData.tiktok },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Badge icon large */}
            {badge && badge.level !== "none" && (
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white ring-2 shadow-sm dark:bg-dark-card ${BADGE_RING_COLORS[badge.level] ?? ""}`}>
                {BADGE_ICONS[badge.level]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{umkm.nama}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {umkm.kecamatan} · {umkm.kategori} · {umkm.pemilik}
              </p>
              {badge && badge.level !== "none" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${badge.bgColor} ${badge.color}`}>
                    {BADGE_ICONS[badge.level]}
                    {badge.label}
                  </span>
                  <span className="text-xs text-slate-400">{badge.criteria.monitoringCount}x monitoring</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setForm({
                jumlah_tenaga_kerja: latestData.jumlah_tenaga_kerja != null ? String(latestData.jumlah_tenaga_kerja) : "",
                omzet: "",
                halal: latestData.halal ?? "",
                pirt: latestData.pirt ?? "",
                haki: latestData.haki ?? "",
                nib: latestData.nib ?? "",
                kbli: umkm.kbli ?? [],
                instagram: latestData.instagram ?? "",
                facebook: latestData.facebook ?? "",
                tiktok: latestData.tiktok ?? "",
                kebutuhan_utama: "",
                catatan: "",
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={16} />
            Tambah Monitoring
          </button>
        </div>
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Badge Progress + Ringkasan */}
        <div className="space-y-6 lg:col-span-1">
          {/* Badge Progress */}
          {badge && badge.level !== "none" && criteriaConfig && (
            <div className="rounded-xl bg-white p-5 dark:bg-dark-card">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Kriteria Badge</h3>

              {/* Badge Level Stepper */}
              {(() => {
                const LEVEL_STYLES = {
                  bronze: {
                    reached: "bg-amber-50 dark:bg-amber-900/20",
                    current: "bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-900/30 dark:ring-amber-400 scale-110",
                    icon: "text-amber-500 dark:text-amber-400",
                    iconCurrent: "text-amber-600 dark:text-amber-400",
                    line: "bg-amber-400 dark:bg-amber-500",
                    lineGrad: "bg-gradient-to-r from-amber-400 to-slate-200 dark:from-amber-500 dark:to-slate-700",
                  },
                  silver: {
                    reached: "bg-emerald-50 dark:bg-emerald-900/20",
                    current: "bg-emerald-100 ring-2 ring-emerald-500 dark:bg-emerald-900/30 dark:ring-emerald-400 scale-110",
                    icon: "text-emerald-500 dark:text-emerald-400",
                    iconCurrent: "text-emerald-600 dark:text-emerald-400",
                    line: "bg-emerald-400 dark:bg-emerald-500",
                    lineGrad: "bg-gradient-to-r from-emerald-400 to-slate-200 dark:from-emerald-500 dark:to-slate-700",
                  },
                  gold: {
                    reached: "bg-orange-50 dark:bg-orange-900/20",
                    current: "bg-orange-100 ring-2 ring-orange-500 dark:bg-orange-900/30 dark:ring-orange-400 scale-110",
                    icon: "text-orange-500 dark:text-orange-400",
                    iconCurrent: "text-orange-600 dark:text-orange-400",
                    line: "bg-orange-400 dark:bg-orange-500",
                    lineGrad: "bg-gradient-to-r from-orange-400 to-slate-200 dark:from-orange-500 dark:to-slate-700",
                  },
                  platinum: {
                    reached: "bg-purple-50 dark:bg-purple-900/20",
                    current: "bg-purple-100 ring-2 ring-purple-500 dark:bg-purple-900/30 dark:ring-purple-400 scale-110",
                    icon: "text-purple-500 dark:text-purple-400",
                    iconCurrent: "text-purple-600 dark:text-purple-400",
                    line: "bg-purple-400 dark:bg-purple-500",
                    lineGrad: "bg-gradient-to-r from-purple-400 to-slate-200 dark:from-purple-500 dark:to-slate-700",
                  },
                } as const;

                const levels: { key: keyof typeof LEVEL_STYLES; label: string; icon: React.ReactNode }[] = [
                  { key: "bronze", label: "Pemula", icon: <SeedlingIcon className="h-4 w-4" /> },
                  { key: "silver", label: "Tumbuh", icon: <SilverMedalIcon className="h-4 w-4" /> },
                  { key: "gold", label: "Berkembang", icon: <GoldMedalIcon className="h-4 w-4" /> },
                  { key: "platinum", label: "Naik Kelas", icon: <DiamondIcon className="h-4 w-4" /> },
                ];
                const levelOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
                const currentIdx = levelOrder[badge.level as keyof typeof levelOrder] ?? 0;

                return (
                  <div className="mb-4">
                    <div className="flex items-center">
                      {levels.map((lvl, idx) => {
                        const isReached = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const s = LEVEL_STYLES[lvl.key];
                        return (
                          <div key={lvl.key} className="flex items-center flex-1 last:flex-initial">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                                isCurrent ? s.current : isReached ? s.reached : "bg-slate-100 dark:bg-white/5"
                              }`}>
                                <span className={isCurrent ? s.iconCurrent : isReached ? s.icon : "text-slate-400 dark:text-slate-600"}>
                                  {lvl.icon}
                                </span>
                              </div>
                              <span className={`mt-1 text-[10px] font-medium ${
                                isCurrent ? s.iconCurrent : isReached ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-600"
                              }`}>
                                {lvl.label}
                              </span>
                            </div>
                            {idx < levels.length - 1 && (
                              <div className={`mx-1 h-0.5 flex-1 transition-all duration-300 ${
                                idx < currentIdx ? s.line : idx === currentIdx ? s.lineGrad : "bg-slate-200 dark:bg-slate-700"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Individual Progress Bars */}
              <div className="space-y-3">
                <ProgressBar
                  current={badge.criteria.omzet ?? 0}
                  target={criteriaConfig.platinum_omzet_min}
                  label="Omzet"
                  format="rupiah"
                />
                <ProgressBar
                  current={badge.criteria.tk ?? 0}
                  target={criteriaConfig.platinum_tk_min}
                  label="Tenaga Kerja"
                />
                <ProgressBar
                  current={badge.criteria.legalitas}
                  target={criteriaConfig.platinum_legalitas_min}
                  label="Legalitas"
                />
                <ProgressBar
                  current={badge.criteria.sosmed}
                  target={criteriaConfig.platinum_sosmed_min}
                  label="Sosmed Aktif"
                />
              </div>
            </div>
          )}

          {/* Ringkasan Data */}
          <div className="rounded-xl bg-white p-5 dark:bg-dark-card">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Ringkasan Data</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Tenaga Kerja</span>
                <span className="font-medium text-slate-900 dark:text-white">{latestData.jumlah_tenaga_kerja ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Omzet</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatRupiah(latestData.omzet)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-white/[0.06] pt-2.5">
                <p className="text-xs font-medium text-slate-400 mb-2">Legalitas</p>
                {legalItems.length > 0 ? (
                  <div className="space-y-1">
                    {legalItems.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">-</p>
                )}
              </div>
              <div className="border-t border-slate-100 dark:border-white/[0.06] pt-2.5">
                <p className="text-xs font-medium text-slate-400 mb-2">Sosmed</p>
                {sosmedItems.length > 0 ? (
                  <div className="space-y-1">
                    {sosmedItems.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">-</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Riwayat Monitoring */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white dark:bg-dark-card">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Monitoring</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {monitorings.length} kali monitoring{latest ? ` · Terakhir: ${formatDate(latest.created_at)}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {monitorings.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-400">Belum ada riwayat monitoring</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                {/* Data Awal (sebelum monitoring) */}
                <div className="px-5 py-4 bg-slate-50/50 dark:bg-white/[0.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data Awal</p>
                        <p className="text-xs text-slate-400">Sebelum monitoring</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === "initial" ? null : "initial")}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
                    >
                      {expandedEntry === "initial" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  <div className="mt-2 ml-5.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500">
                      TK: <span className="font-medium text-slate-600 dark:text-slate-400">{umkm.jumlah_tenaga_kerja ?? "-"}</span>
                    </span>
                    <span className="text-slate-500">
                      Omzet: <span className="font-medium text-slate-600 dark:text-slate-400">{formatRupiah(umkm.omzet)}</span>
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">
                      Legalitas: <span className="font-medium text-slate-600 dark:text-slate-400">
                        {((umkm.nib || (umkm.kbli && umkm.kbli.length > 0)) ? 1 : 0) + (umkm.halal ? 1 : 0) + (umkm.pirt ? 1 : 0) + (umkm.haki ? 1 : 0)}
                      </span>
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">
                      Sosmed: <span className="font-medium text-slate-600 dark:text-slate-400">
                        {(umkm.instagram ? 1 : 0) + (umkm.facebook ? 1 : 0) + (umkm.tiktok ? 1 : 0)}
                      </span>
                    </span>
                  </div>
                  {/* Expanded details for data awal */}
                  <div className={`ml-5.5 grid transition-all duration-300 ease-in-out ${expandedEntry === "initial" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden min-h-0">
                      <div className="mt-3 rounded-lg bg-white p-4 dark:bg-white/[0.03] space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1.5">Legalitas</p>
                          <div className="flex flex-wrap gap-1.5">
                            {((): { label: string; value: string }[] => {
                              const items: { label: string; value: string }[] = [];
                              if (umkm.nib) items.push({ label: "NIB", value: umkm.nib });
                              if (umkm.kbli && umkm.kbli.length > 0) items.push({ label: "KBLI", value: umkm.kbli.join(", ") });
                              if (umkm.halal) items.push({ label: "Halal", value: umkm.halal });
                              if (umkm.pirt) items.push({ label: "PIRT", value: umkm.pirt });
                              if (umkm.haki) items.push({ label: "HAKI", value: umkm.haki });
                              return items;
                            })().map((item) => (
                              <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400">
                                • {item.label} <span className="opacity-60">{item.value}</span>
                              </span>
                            ))}
                            {!(umkm.nib || (umkm.kbli && umkm.kbli.length > 0) || umkm.halal || umkm.pirt || umkm.haki) && (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1.5">Sosmed</p>
                          <div className="flex flex-wrap gap-1.5">
                            {((): { label: string; value: string }[] => {
                              const items: { label: string; value: string }[] = [];
                              if (umkm.instagram) items.push({ label: "Instagram", value: umkm.instagram });
                              if (umkm.facebook) items.push({ label: "Facebook", value: umkm.facebook });
                              if (umkm.tiktok) items.push({ label: "TikTok", value: umkm.tiktok });
                              return items;
                            })().map((item) => (
                              <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400">
                                • {item.label} <span className="opacity-60">{item.value}</span>
                              </span>
                            ))}
                            {!umkm.instagram && !umkm.facebook && !umkm.tiktok && <span className="text-xs text-slate-400">-</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {monitorings.map((entry, idx) => {
                  const isExpanded = expandedEntry === entry.id;
                  const prevEntry = monitorings[idx + 1];
                  const entryData = getEntryData(entry);

                  return (
                    <div key={entry.id} className="px-5 py-4">
                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Timeline dot */}
                          <div className="relative">
                            <div className={`h-2.5 w-2.5 rounded-full ${idx === 0 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                            {idx === 0 && <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-40" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              Monitoring #{monitorings.length - idx}
                            </p>
                            <p className="text-xs text-slate-400">{formatDateTime(entry.created_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Trend badges */}
                          {prevEntry && (
                            <div className="flex items-center gap-2">
                              <TrendBadge current={entry.omzet} previous={prevEntry.omzet} format="rupiah" />
                              <TrendBadge current={entry.jumlah_tenaga_kerja} previous={prevEntry.jumlah_tenaga_kerja} />
                            </div>
                          )}

                          {/* Expand toggle */}
                          <button
                            onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div className="mt-2 ml-5.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500">
                          TK: <span className="font-medium text-slate-700 dark:text-slate-300">{entryData.jumlah_tenaga_kerja ?? "-"}</span>
                        </span>
                        <span className="text-slate-500">
                          Omzet: <span className="font-medium text-slate-700 dark:text-slate-300">{formatRupiah(entryData.omzet)}</span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          Legalitas: <span className="font-medium text-slate-700 dark:text-slate-300">
                            {((entryData.nib || (umkm.kbli && umkm.kbli.length > 0)) ? 1 : 0) + (entryData.halal ? 1 : 0) + (entryData.pirt ? 1 : 0) + (entryData.haki ? 1 : 0)}
                          </span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          Sosmed: <span className="font-medium text-slate-700 dark:text-slate-300">
                            {(entryData.instagram ? 1 : 0) + (entryData.facebook ? 1 : 0) + (entryData.tiktok ? 1 : 0)}
                          </span>
                        </span>
                      </div>

                      {/* Expanded details */}
                      <div className={`ml-5.5 grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden min-h-0">
                          <div className="mt-3 rounded-lg bg-slate-50 p-4 dark:bg-white/[0.02] space-y-3">
                          {/* Legalitas */}
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-1.5">Legalitas</p>
                            <div className="flex flex-wrap gap-1.5">
                              {((): { label: string; value: string; isNew: boolean }[] => {
                                const prevData = prevEntry ? getEntryData(prevEntry) : { nib: _umkm.nib, halal: _umkm.halal, pirt: _umkm.pirt, haki: _umkm.haki };
                                const prevKbli = prevEntry ? (prevEntry.kbli ?? _umkm.kbli) : _umkm.kbli;
                                const items: { label: string; value: string; isNew: boolean }[] = [];
                                if (entryData.nib) items.push({ label: "NIB", value: entryData.nib, isNew: !prevData.nib });
                                if (_umkm.kbli && _umkm.kbli.length > 0) items.push({ label: "KBLI", value: _umkm.kbli.join(", "), isNew: !(prevKbli && prevKbli.length > 0) });
                                if (entryData.halal) items.push({ label: "Halal", value: entryData.halal, isNew: !prevData.halal });
                                if (entryData.pirt) items.push({ label: "PIRT", value: entryData.pirt, isNew: !prevData.pirt });
                                if (entryData.haki) items.push({ label: "HAKI", value: entryData.haki, isNew: !prevData.haki });
                                return items;
                              })().map((item) => (
                                <span key={item.label} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                  item.isNew
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                }`}>
                                  {item.isNew ? "✓" : "•"} {item.label}
                                  <span className="opacity-60">{item.value}</span>
                                </span>
                              ))}
                              {!(entryData.nib || (umkm.kbli && umkm.kbli.length > 0) || entryData.halal || entryData.pirt || entryData.haki) && (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </div>
                          </div>

                          {/* Sosmed */}
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-1.5">Sosmed</p>
                            <div className="flex flex-wrap gap-1.5">
                              {((): { label: string; value: string; isNew: boolean }[] => {
                                const prevData = prevEntry ? getEntryData(prevEntry) : { instagram: umkm.instagram, facebook: umkm.facebook, tiktok: umkm.tiktok };
                                const items: { label: string; value: string; isNew: boolean }[] = [];
                                if (entryData.instagram) items.push({ label: "Instagram", value: entryData.instagram, isNew: !prevData.instagram });
                                if (entryData.facebook) items.push({ label: "Facebook", value: entryData.facebook, isNew: !prevData.facebook });
                                if (entryData.tiktok) items.push({ label: "TikTok", value: entryData.tiktok, isNew: !prevData.tiktok });
                                return items;
                              })().map((item) => (
                                <span key={item.label} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                  item.isNew
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                }`}>
                                  {item.isNew ? "✓" : "•"} {item.label}
                                  <span className="opacity-60">{item.value}</span>
                                </span>
                              ))}
                              {!entryData.instagram && !entryData.facebook && !entryData.tiktok && <span className="text-xs text-slate-400">-</span>}
                            </div>
                          </div>

                          {/* Catatan */}
                          {(entry.kebutuhan_utama || entry.catatan) && (
                            <div className="border-t border-slate-100 dark:border-white/[0.06] pt-2.5">
                              {entry.kebutuhan_utama && (
                                <p className="text-xs text-slate-500">
                                  <span className="font-medium">Kebutuhan:</span> {entry.kebutuhan_utama}
                                </p>
                              )}
                              {entry.catatan && (
                                <p className="text-xs text-slate-500 mt-1">
                                  <span className="font-medium">Catatan:</span> {entry.catatan}
                                </p>
                              )}
                            </div>
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Tambah Monitoring</h2>
            <p className="text-sm text-slate-500 mt-1">Isi hanya data yang berubah/lengkap baru</p>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah Tenaga Kerja</label>
                  <input
                    type="number"
                    value={form.jumlah_tenaga_kerja}
                    onChange={(e) => setForm((p) => ({ ...p, jumlah_tenaga_kerja: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    placeholder={String(umkm.jumlah_tenaga_kerja ?? "-")}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Omzet (Rp)</label>
                  <input
                    type="number"
                    value={form.omzet}
                    onChange={(e) => setForm((p) => ({ ...p, omzet: e.target.value.replace(/\D/g, "") }))}
                    placeholder={String(umkm.omzet ?? "-")}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">NIB</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.nib}
                    onChange={(e) => setForm((p) => ({ ...p, nib: e.target.value.replace(/\D/g, "").slice(0, 13) }))}
                    placeholder={umkm.nib ?? "13 digit NIB"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white"
                  />
                  <p className="mt-1 text-xs text-slate-400">Maksimal 13 digit angka</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">KBLI</label>
                  <KBLISelect value={form.kbli} onChange={(val) => setForm((p) => ({ ...p, kbli: val }))} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Legalitas</label>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={form.halal} onChange={(e) => setForm((p) => ({ ...p, halal: e.target.value }))} placeholder={umkm.halal ?? "No. Halal"} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                  <input type="text" value={form.pirt} onChange={(e) => setForm((p) => ({ ...p, pirt: e.target.value }))} placeholder={umkm.pirt ?? "No. PIRT"} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                  <input type="text" value={form.haki} onChange={(e) => setForm((p) => ({ ...p, haki: e.target.value }))} placeholder={umkm.haki ?? "No. HAKI"} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sosmed</label>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={form.instagram} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))} placeholder="@username" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                  <input type="text" value={form.facebook} onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))} placeholder="Facebook URL" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                  <input type="text" value={form.tiktok} onChange={(e) => setForm((p) => ({ ...p, tiktok: e.target.value }))} placeholder="@username" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Kebutuhan Utama</label>
                <textarea value={form.kebutuhan_utama} onChange={(e) => setForm((p) => ({ ...p, kebutuhan_utama: e.target.value }))} placeholder="Contoh: butuh bantuan pemasaran online, butuh legalitas halal, dll" rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan</label>
                <textarea value={form.catatan} onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))} placeholder="Catatan tambahan dari kunjungan/monitoring" rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800">
                Batal
              </button>
              <button onClick={handleAddMonitoring} disabled={saving} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
