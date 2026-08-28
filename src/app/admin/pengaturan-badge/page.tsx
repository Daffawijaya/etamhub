"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";
import { Save, RotateCcw } from "lucide-react";

interface BadgeCriteria {
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
  silver_label: string;
  gold_label: string;
  platinum_label: string;
}

const DEFAULTS: BadgeCriteria = {
  silver_omzet_min: 5000000,
  silver_tk_min: 1,
  silver_legalitas_min: 0,
  silver_sosmed_min: 0,
  gold_omzet_min: 10000000,
  gold_tk_min: 3,
  gold_legalitas_min: 1,
  gold_sosmed_min: 1,
  platinum_omzet_min: 25000000,
  platinum_tk_min: 5,
  platinum_legalitas_min: 2,
  platinum_sosmed_min: 2,
  silver_label: "🥈 Berkembang",
  gold_label: "🥇 Berkembang Pesat",
  platinum_label: "💎 Naik Kelas",
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function PengaturanBadgePage() {
  const [criteria, setCriteria] = useState<BadgeCriteria>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/badge-criteria")
      .then((res) => res.json())
      .then((data) => {
        if (data.silver_omzet_min !== undefined) {
          setCriteria({ ...DEFAULTS, ...data, silver_label: data.silver_label ?? "", gold_label: data.gold_label ?? "", platinum_label: data.platinum_label ?? "" });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/badge-criteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan kriteria badge");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setCriteria(DEFAULTS);
  }

  function updateField<K extends keyof BadgeCriteria>(field: K, value: BadgeCriteria[K]) {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) return <LoadingState />;

  return (
    <main className="px-6 pb-6 space-y-6">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Menyimpan..." : saved ? "✓ Tersimpan" : "Simpan"}
        </button>
      </div>

      {/* Pemula (Bronze) — Tier 1 */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🥉</span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pemula</h2>
            <p className="text-xs text-slate-400">Sudah mulai monitoring (minimal 1 kunjungan)</p>
          </div>
        </div>
      </div>

      {/* Berkembang (Silver) — Tier 2 */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🥈</span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Berkembang</h2>
            <input
              type="text"
              value={criteria.silver_label ?? ""}
              onChange={(e) => updateField("silver_label", e.target.value)}
              className="mt-1 text-sm text-slate-500 dark:text-slate-400 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-60"
              placeholder="Label badge"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Omzet</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-400">Rp</span>
              <input
                type="number"
                value={criteria.silver_omzet_min}
                onChange={(e) => updateField("silver_omzet_min", Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Karyawan</label>
            <input
              type="number"
              value={criteria.silver_tk_min}
              onChange={(e) => updateField("silver_tk_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Legalitas</label>
            <input
              type="number"
              value={criteria.silver_legalitas_min}
              onChange={(e) => updateField("silver_legalitas_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Jenis (Halal/PIRT/HAKI)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Sosmed Aktif</label>
            <input
              type="number"
              value={criteria.silver_sosmed_min}
              onChange={(e) => updateField("silver_sosmed_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Platform (IG/FB/TT)</p>
          </div>
        </div>
      </div>

      {/* Berkembang Pesat (Gold) — Tier 3 */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🥇</span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Berkembang Pesat</h2>
            <input
              type="text"
              value={criteria.gold_label ?? ""}
              onChange={(e) => updateField("gold_label", e.target.value)}
              className="mt-1 text-sm text-slate-500 dark:text-slate-400 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-60"
              placeholder="Label badge"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Omzet</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-400">Rp</span>
              <input
                type="number"
                value={criteria.gold_omzet_min}
                onChange={(e) => updateField("gold_omzet_min", Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Karyawan</label>
            <input
              type="number"
              value={criteria.gold_tk_min}
              onChange={(e) => updateField("gold_tk_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Legalitas</label>
            <input
              type="number"
              value={criteria.gold_legalitas_min}
              onChange={(e) => updateField("gold_legalitas_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Jenis (Halal/PIRT/HAKI)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Sosmed Aktif</label>
            <input
              type="number"
              value={criteria.gold_sosmed_min}
              onChange={(e) => updateField("gold_sosmed_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Platform (IG/FB/TT)</p>
          </div>
        </div>
      </div>

      {/* Naik Kelas (Platinum) — Tier 4, Top badge */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card ring-2 ring-purple-200 dark:ring-purple-900/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💎</span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Naik Kelas <span className="text-xs font-normal text-purple-500 dark:text-purple-400">(Tertinggi)</span></h2>
            <input
              type="text"
              value={criteria.platinum_label ?? ""}
              onChange={(e) => updateField("platinum_label", e.target.value)}
              className="mt-1 text-sm text-slate-500 dark:text-slate-400 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-60"
              placeholder="Label badge"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Omzet</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-400">Rp</span>
              <input
                type="number"
                value={criteria.platinum_omzet_min}
                onChange={(e) => updateField("platinum_omzet_min", Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Karyawan</label>
            <input
              type="number"
              value={criteria.platinum_tk_min}
              onChange={(e) => updateField("platinum_tk_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Legalitas</label>
            <input
              type="number"
              value={criteria.platinum_legalitas_min}
              onChange={(e) => updateField("platinum_legalitas_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Jenis (Halal/PIRT/HAKI)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Sosmed Aktif</label>
            <input
              type="number"
              value={criteria.platinum_sosmed_min}
              onChange={(e) => updateField("platinum_sosmed_min", Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Platform (IG/FB/TT)</p>
          </div>
        </div>
      </div>

      {/* Preview Ringkasan */}
      <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Ringkasan Kriteria
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              🥉 Pemula
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Sudah mulai monitoring (minimal 1 kunjungan)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700/30 dark:text-slate-300">
              🥈 Berkembang
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Omzet ≥ Rp{formatRupiah(criteria.silver_omzet_min)}, TK ≥ {criteria.silver_tk_min}
              {criteria.silver_legalitas_min > 0 && `, Legalitas ≥ ${criteria.silver_legalitas_min}`}
              {criteria.silver_sosmed_min > 0 && `, Sosmed ≥ ${criteria.silver_sosmed_min}`}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              🥇 Berkembang Pesat
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Omzet ≥ Rp{formatRupiah(criteria.gold_omzet_min)}, TK ≥ {criteria.gold_tk_min}
              {criteria.gold_legalitas_min > 0 && `, Legalitas ≥ ${criteria.gold_legalitas_min}`}
              {criteria.gold_sosmed_min > 0 && `, Sosmed ≥ ${criteria.gold_sosmed_min}`}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
              💎 Naik Kelas
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Omzet ≥ Rp{formatRupiah(criteria.platinum_omzet_min)}, TK ≥ {criteria.platinum_tk_min}
              {criteria.platinum_legalitas_min > 0 && `, Legalitas ≥ ${criteria.platinum_legalitas_min}`}
              {criteria.platinum_sosmed_min > 0 && `, Sosmed ≥ ${criteria.platinum_sosmed_min}`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
