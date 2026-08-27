"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { Plus, TrendingUp, TrendingDown, Minus, Award, ArrowRight } from "lucide-react";
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
    omzetIncrease: number | null;
    tkChange: number | null;
    legalitasAdded: number;
    sosmedCount: number;
    monitoringCount: number;
  };
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

function formatPercentage(value: number | null) {
  if (value === null) return null;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

function CompareRow({
  label,
  initial,
  latest,
  format = "text",
  showTrend = true,
}: {
  label: string;
  initial: number | null;
  latest: number | null;
  format?: "text" | "rupiah" | "number";
  showTrend?: boolean;
}) {
  const fmt = (v: number | null) => {
    if (v === null || v === undefined) return "-";
    if (format === "rupiah") return formatRupiah(v);
    return String(v);
  };

  const diff = (initial ?? 0) - (latest ?? 0);
  const pctChange =
    initial && initial > 0 && latest !== null
      ? Math.round(((latest - initial) / initial) * 100)
      : null;

  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-white/5">
      <div className="flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-white">
            {fmt(initial)}
          </span>
          {showTrend && latest !== null && initial !== null && initial !== latest && (
            <>
              <ArrowRight size={12} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {fmt(latest)}
              </span>
            </>
          )}
        </div>
        {showTrend && pctChange !== null && pctChange !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              pctChange > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {pctChange > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {formatPercentage(pctChange)}
          </span>
        )}
      </div>
    </div>
  );
}

function CompareCheck({
  label,
  initial,
  latest,
}: {
  label: string;
  initial: string | null;
  latest: string | null;
}) {
  const wasEmpty = !initial;
  const isFilled = !!latest;
  const added = wasEmpty && isFilled;

  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-white/5">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-700 dark:text-white">
          {latest || "-"}
        </p>
      </div>
      {added && (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Baru
        </span>
      )}
    </div>
  );
}

function Trend({
  current,
  previous,
  label,
  format = "number",
}: {
  current: number | null;
  previous: number | null;
  label: string;
  format?: "number" | "rupiah";
}) {
  const curr = current ?? 0;
  const prev = previous ?? 0;
  const diff = curr - prev;

  if (prev === 0 && curr === 0) return null;

  const formatted =
    format === "rupiah"
      ? `${diff > 0 ? "+" : ""}${formatRupiah(diff)}`
      : `${diff > 0 ? "+" : ""}${diff}`;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        diff > 0
          ? "text-green-600 dark:text-green-400"
          : diff < 0
            ? "text-red-600 dark:text-red-400"
            : "text-slate-400"
      }`}
    >
      {diff > 0 ? (
        <TrendingUp size={12} />
      ) : diff < 0 ? (
        <TrendingDown size={12} />
      ) : (
        <Minus size={12} />
      )}
      {label} {formatted}
    </span>
  );
}

export default function MonitoringDetailPage() {
  const params = useParams();
  const umkmId = params.umkmId as string;

  const [umkm, setUmkm] = useState<UmkmData | null>(null);
  const [monitorings, setMonitorings] = useState<MonitoringEntry[]>([]);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
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
      if (form.halal) payload.halal = form.halal;
      if (form.pirt) payload.pirt = form.pirt;
      if (form.haki) payload.haki = form.haki;
      if (form.nib) payload.nib = form.nib;
      if (form.kbli.length > 0) payload.kbli = form.kbli;
      if (form.instagram) payload.instagram = form.instagram;
      if (form.facebook) payload.facebook = form.facebook;
      if (form.tiktok) payload.tiktok = form.tiktok;
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
  const prev = monitorings[1] ?? null;

  // Build comparison data: initial (from UMKM) vs latest (from latest monitoring)
  const initialData = {
    omzet: umkm.omzet,
    jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja,
    halal: umkm.halal,
    pirt: umkm.pirt,
    haki: umkm.haki,
    instagram: umkm.instagram,
    facebook: umkm.facebook,
    tiktok: umkm.tiktok,
  };

  const latestData = latest
    ? {
        omzet: latest.omzet ?? umkm.omzet,
        jumlah_tenaga_kerja: latest.jumlah_tenaga_kerja ?? umkm.jumlah_tenaga_kerja,
        halal: latest.halal ?? umkm.halal,
        pirt: latest.pirt ?? umkm.pirt,
        haki: latest.haki ?? umkm.haki,
        instagram: latest.instagram ?? umkm.instagram,
        facebook: latest.facebook ?? umkm.facebook,
        tiktok: latest.tiktok ?? umkm.tiktok,
      }
    : initialData;

  return (
    <main className="px-6 pb-6 space-y-6">
      {/* Header UMKM + Badge */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {umkm.nama}
              </h1>
              {badge && badge.level !== "none" && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${badge.bgColor} ${badge.color}`}>
                  <Award size={14} />
                  {badge.label}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {umkm.kecamatan} · {umkm.kategori} · {umkm.pemilik}
            </p>
            {badge && badge.level !== "none" && (
              <p className="mt-1 text-xs text-slate-400">{badge.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={16} />
            Tambah Monitoring
          </button>
        </div>

        {/* Badge Criteria Progress */}
        {badge && badge.level !== "none" && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
            <p className="text-xs font-medium text-slate-500 mb-2">Kriteria Perolehan Badge</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 text-xs">
              <div className={`flex items-center gap-1.5 ${badge.criteria.omzetIncrease !== null && badge.criteria.omzetIncrease >= 20 ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                {badge.criteria.omzetIncrease !== null && badge.criteria.omzetIncrease >= 20 ? "✅" : "⬜"}
                Omzet {badge.criteria.omzetIncrease !== null ? `${badge.criteria.omzetIncrease > 0 ? "+" : ""}${badge.criteria.omzetIncrease}%` : "N/A"}
              </div>
              <div className={`flex items-center gap-1.5 ${badge.criteria.tkChange !== null && badge.criteria.tkChange > 0 ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                {badge.criteria.tkChange !== null && badge.criteria.tkChange > 0 ? "✅" : "⬜"}
                Tenaga Kerja {badge.criteria.tkChange !== null ? (badge.criteria.tkChange > 0 ? `+${badge.criteria.tkChange}` : badge.criteria.tkChange) : "N/A"}
              </div>
              <div className={`flex items-center gap-1.5 ${badge.criteria.legalitasAdded > 0 ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                {badge.criteria.legalitasAdded > 0 ? "✅" : "⬜"}
                Legalitas {badge.criteria.legalitasAdded > 0 ? `+${badge.criteria.legalitasAdded}` : "bertambah"}
              </div>
              <div className={`flex items-center gap-1.5 ${badge.criteria.sosmedCount >= 2 ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                {badge.criteria.sosmedCount >= 2 ? "✅" : "⬜"}
                Sosmed aktif ({badge.criteria.sosmedCount} platform)
              </div>
            </div>
          </div>
        )}

        {/* Data UMKM Awal */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <p className="text-xs text-slate-400">Tenaga Kerja</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              {umkm.jumlah_tenaga_kerja ?? "-"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <p className="text-xs text-slate-400">Omzet</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              {formatRupiah(umkm.omzet)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <p className="text-xs text-slate-400">NIB</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              {umkm.nib ?? "-"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <p className="text-xs text-slate-400">Legalitas</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              {[
                umkm.halal && "Halal",
                umkm.pirt && "PIRT",
                umkm.haki && "HAKI",
              ]
                .filter(Boolean)
                .join(", ") || "-"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <p className="text-xs text-slate-400">KBLI</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              {umkm.kbli?.join(", ") || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Perbandingan Sebelum vs Sesudah */}
      {monitorings.length > 0 && (
        <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Perbandingan: Data Awal vs Monitoring Terakhir
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {monitorings.length} kali monitoring · Terakhir: {latest ? formatDate(latest.created_at) : "-"}
          </p>

          {/* Numerical comparisons */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <CompareRow
              label="Omzet"
              initial={initialData.omzet}
              latest={latestData.omzet}
              format="rupiah"
            />
            <CompareRow
              label="Jumlah Tenaga Kerja"
              initial={initialData.jumlah_tenaga_kerja}
              latest={latestData.jumlah_tenaga_kerja}
            />
          </div>

          {/* Legalitas & Sosmed comparisons */}
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CompareCheck label="Halal" initial={initialData.halal} latest={latestData.halal} />
            <CompareCheck label="PIRT" initial={initialData.pirt} latest={latestData.pirt} />
            <CompareCheck label="HAKI" initial={initialData.haki} latest={latestData.haki} />
            <CompareCheck label="Instagram" initial={initialData.instagram} latest={latestData.instagram} />
            <CompareCheck label="Facebook" initial={initialData.facebook} latest={latestData.facebook} />
            <CompareCheck label="TikTok" initial={initialData.tiktok} latest={latestData.tiktok} />
          </div>

          {/* Trend vs previous entry */}
          {prev && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-xs text-slate-400 mb-2">Trend Monitoring Terakhir vs Sebelumnya</p>
              <div className="flex flex-wrap gap-4">
                <Trend
                  current={latest?.omzet}
                  previous={prev.omzet}
                  label="Omzet"
                  format="rupiah"
                />
                <Trend
                  current={latest?.jumlah_tenaga_kerja}
                  previous={prev.jumlah_tenaga_kerja}
                  label="TK"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Riwayat Monitoring */}
      <div className="rounded-xl bg-white dark:bg-dark-card">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Riwayat Monitoring ({monitorings.length})
          </h2>
        </div>

        {monitorings.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Belum ada riwayat monitoring
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {monitorings.map((entry, idx) => (
              <div key={entry.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Monitoring #{monitorings.length - idx}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>

                  {/* Trend vs previous entry */}
                  {idx < monitorings.length - 1 && (
                    <div className="flex flex-col items-end gap-1">
                      <Trend
                        current={entry.omzet}
                        previous={monitorings[idx + 1].omzet}
                        label="Omzet"
                        format="rupiah"
                      />
                      <Trend
                        current={entry.jumlah_tenaga_kerja}
                        previous={monitorings[idx + 1].jumlah_tenaga_kerja}
                        label="TK"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 md:grid-cols-4">
                  <span>TK: {entry.jumlah_tenaga_kerja ?? "-"}</span>
                  <span>Omzet: {formatRupiah(entry.omzet)}</span>
                  <span>
                    Legalitas:{" "}
                    {[
                      entry.halal && "Halal",
                      entry.pirt && "PIRT",
                      entry.haki && "HAKI",
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </span>
                  <span>
                    Sosmed:{" "}
                    {[
                      entry.instagram && "IG",
                      entry.facebook && "FB",
                      entry.tiktok && "TT",
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </span>
                </div>

                {entry.kebutuhan_utama && (
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Kebutuhan:</span>{" "}
                    {entry.kebutuhan_utama}
                  </p>
                )}

                {entry.catatan && (
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-medium">Catatan:</span>{" "}
                    {entry.catatan}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Tambah Monitoring */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Tambah Monitoring
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Isi hanya data yang berubah/lengkap baru
            </p>

            <div className="mt-4 space-y-4">
              {/* Tenaga Kerja & Omzet */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Jumlah Tenaga Kerja
                  </label>
                  <input
                    type="number"
                    value={form.jumlah_tenaga_kerja}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, jumlah_tenaga_kerja: e.target.value }))
                    }
                    placeholder={String(umkm.jumlah_tenaga_kerja ?? "-")}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Omzet (Rp)
                  </label>
                  <input
                    type="number"
                    value={form.omzet}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, omzet: e.target.value }))
                    }
                    placeholder={String(umkm.omzet ?? "-")}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
              </div>

              {/* NIB & KBLI */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  NIB
                </label>
                <input
                  type="text"
                  value={form.nib}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nib: e.target.value }))
                  }
                  placeholder={umkm.nib ?? "13 digit NIB"}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  KBLI
                </label>
                <KBLISelect
                  value={form.kbli}
                  onChange={(val) => setForm((p) => ({ ...p, kbli: val }))}
                />
              </div>

              {/* Legalitas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Halal
                  </label>
                  <input
                    type="text"
                    value={form.halal}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, halal: e.target.value }))
                    }
                    placeholder={umkm.halal ?? "No. Sertifikat"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    PIRT
                  </label>
                  <input
                    type="text"
                    value={form.pirt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, pirt: e.target.value }))
                    }
                    placeholder={umkm.pirt ?? "No. PIRT"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    HAKI
                  </label>
                  <input
                    type="text"
                    value={form.haki}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, haki: e.target.value }))
                    }
                    placeholder={umkm.haki ?? "No. HAKI"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
              </div>

              {/* Sosmed */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, instagram: e.target.value }))
                    }
                    placeholder={umkm.instagram ?? "-"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={form.facebook}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, facebook: e.target.value }))
                    }
                    placeholder={umkm.facebook ?? "-"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    TikTok
                  </label>
                  <input
                    type="text"
                    value={form.tiktok}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, tiktok: e.target.value }))
                    }
                    placeholder={umkm.tiktok ?? "-"}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                  />
                </div>
              </div>

              {/* Kebutuhan Utama */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kebutuhan Utama
                </label>
                <textarea
                  value={form.kebutuhan_utama}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kebutuhan_utama: e.target.value }))
                  }
                  placeholder="Contoh: butuh bantuan pemasaran online, butuh legalitas halal, dll"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Catatan
                </label>
                <textarea
                  value={form.catatan}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, catatan: e.target.value }))
                  }
                  placeholder="Catatan tambahan dari kunjungan/monitoring"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                onClick={handleAddMonitoring}
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
