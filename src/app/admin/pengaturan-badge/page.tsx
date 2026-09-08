"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";
import { useModal } from "@/components/ui/modal";
import { Save, RotateCcw } from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import BrandButton from "@/components/ui/BrandButton";

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
  omzet_on: boolean;
  tk_on: boolean;
  legalitas_on: boolean;
  sosmed_on: boolean;
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
  silver_label: "Tumbuh",
  gold_label: "Berkembang",
  platinum_label: "Naik Kelas",
  omzet_on: true,
  tk_on: true,
  legalitas_on: true,
  sosmed_on: true,
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDisplayNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseFormattedNumber(input: string): number {
  const cleaned = input.replace(/[^\d]/g, "");
  return cleaned === "" ? 0 : Number(cleaned);
}

type TierKey = "pemula" | "silver" | "gold" | "platinum";

type FlagKey = "omzet_on" | "tk_on" | "legalitas_on" | "sosmed_on";

const INDICATORS: { flag: FlagKey; label: string; description: string }[] = [
  { flag: "omzet_on", label: "Omzet", description: "Syarat nilai omzet minimum" },
  { flag: "tk_on", label: "Tenaga Kerja", description: "Syarat jumlah tenaga kerja" },
  { flag: "legalitas_on", label: "Legalitas", description: "Syarat jenis legalitas (Halal/PIRT/HAKI/NIB)" },
  { flag: "sosmed_on", label: "Sosmed Aktif", description: "Syarat platform aktif (WA/IG/FB/TT)" },
];

function IndicatorSwitch({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

const TIERS: {
  key: TierKey;
  icon: React.ReactNode;
  name: string;
  description: string;
  tagBg?: string;
  tagText?: string;
  tagLabel?: string;
  fields?: { key: keyof BadgeCriteria; label: string; prefix?: string; suffix?: string; flag: FlagKey }[];
}[] = [
  {
    key: "pemula",
    icon: <SeedlingIcon className="h-8 w-8" />,
    name: "Pemula",
    description: "Sudah mulai monitoring (minimal 1 kunjungan) — otomatis",
    tagBg: "bg-emerald-50 dark:bg-emerald-900/20",
    tagText: "text-emerald-700 dark:text-emerald-400",
    tagLabel: "Otomatis",
  },
  {
    key: "silver",
    icon: <SilverMedalIcon className="h-8 w-8" />,
    name: "Tumbuh",
    description: "Sudah mulai menunjukkan perkembangan",
    fields: [
      { key: "silver_omzet_min", label: "Minimal Omzet", prefix: "Rp", flag: "omzet_on" },
      { key: "silver_tk_min", label: "Minimal Tenaga Kerja", flag: "tk_on" },
      { key: "silver_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)", flag: "legalitas_on" },
      { key: "silver_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (WA/IG/FB/TT)", flag: "sosmed_on" },
    ],
  },
  {
    key: "gold",
    icon: <GoldMedalIcon className="h-8 w-8" />,
    name: "Berkembang",
    description: "UMKM yang sudah berkembang pesat",
    fields: [
      { key: "gold_omzet_min", label: "Minimal Omzet", prefix: "Rp", flag: "omzet_on" },
      { key: "gold_tk_min", label: "Minimal Tenaga Kerja", flag: "tk_on" },
      { key: "gold_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)", flag: "legalitas_on" },
      { key: "gold_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (WA/IG/FB/TT)", flag: "sosmed_on" },
    ],
  },
  {
    key: "platinum",
    icon: <DiamondIcon className="h-8 w-8" />,
    name: "Naik Kelas",
    description: "Tertinggi — semua kriteria terpenuhi",
    tagBg: "bg-purple-100 dark:bg-purple-900/30",
    tagText: "text-purple-600 dark:text-purple-400",
    tagLabel: "Tertinggi",
    fields: [
      { key: "platinum_omzet_min", label: "Minimal Omzet", prefix: "Rp", flag: "omzet_on" },
      { key: "platinum_tk_min", label: "Minimal Tenaga Kerja", flag: "tk_on" },
      { key: "platinum_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)", flag: "legalitas_on" },
      { key: "platinum_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (WA/IG/FB/TT)", flag: "sosmed_on" },
    ],
  },
];

export default function PengaturanBadgePage() {
  const [criteria, setCriteria] = useState<BadgeCriteria>(DEFAULTS);
  const [initialCriteria, setInitialCriteria] = useState<BadgeCriteria>(DEFAULTS);
  const modal = useModal();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const hasChanges = JSON.stringify(criteria) !== JSON.stringify(initialCriteria);

  useEffect(() => {
    fetch("/api/admin/badge-criteria")
      .then((res) => res.json())
      .then((data) => {
        if (data.silver_omzet_min !== undefined) {
          const loaded = { ...DEFAULTS, ...data, silver_label: data.silver_label ?? "", gold_label: data.gold_label ?? "", platinum_label: data.platinum_label ?? "" };
          setCriteria(loaded);
          setInitialCriteria(loaded);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    const confirmed = await modal.confirm({
      title: "Simpan Kriteria Badge?",
      description: "Perubahan kriteria badge akan diterapkan ke semua UMKM.",
      confirmText: "Simpan",
      cancelText: "Batal",
    });

    if (!confirmed) return;    modal.loading({ title: "Menyimpan..." });
    try {
      const res = await fetch("/api/admin/badge-criteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");


      modal.success({
        title: "Tersimpan!",
        description: "Kriteria badge berhasil diperbarui.",
      });

      setInitialCriteria(criteria);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      modal.error({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan kriteria badge.",
      });
    }
  }

  function handleReset() {
    setCriteria(initialCriteria);
  }

  function updateField<K extends keyof BadgeCriteria>(field: K, value: BadgeCriteria[K]) {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  }

  function tierSummary(prefix: "silver" | "gold" | "platinum") {
    const parts: string[] = [];
    if (criteria.omzet_on) {
      parts.push(`Omzet ≥ Rp${formatRupiah(criteria[`${prefix}_omzet_min`])}`);
    }
    if (criteria.tk_on) {
      parts.push(`TK ≥ ${criteria[`${prefix}_tk_min`]}`);
    }
    if (criteria.legalitas_on && criteria[`${prefix}_legalitas_min`] > 0) {
      parts.push(`Legalitas ≥ ${criteria[`${prefix}_legalitas_min`]}`);
    }
    if (criteria.sosmed_on && criteria[`${prefix}_sosmed_min`] > 0) {
      parts.push(`Sosmed ≥ ${criteria[`${prefix}_sosmed_min`]}`);
    }
    if (parts.length === 0) {
      return "Cukup 1 kunjungan monitoring — otomatis";
    }
    return parts.join(", ");
  }

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="rounded-xl bg-white transition-colors duration-300 dark:bg-dark-card">
        {/* Header — matches berita page style */}
        <div className="px-4 pt-4 pb-3 flex flex-col gap-3 sm:px-6 sm:pt-5 sm:pb-4 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Pengaturan Badge
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Atur kriteria untuk setiap tingkatan badge
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BrandButton variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw size={14} />}>
              Reset
            </BrandButton>
            <BrandButton variant="accent" size="sm" onClick={handleSave} disabled={!hasChanges} icon={<Save size={14} />}>
              {saved ? "✓ Tersimpan" : "Simpan"}
            </BrandButton>
          </div>
        </div>

        {/* Badge tiers */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          {/* Indikator aktif — global untuk semua tier */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 transition-colors duration-300 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Indikator Aktif</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Indikator yang mati diabaikan total di semua tingkatan badge
            </p>
            {!criteria.omzet_on && !criteria.tk_on && !criteria.legalitas_on && !criteria.sosmed_on && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                Semua indikator mati — semua UMKM yang termonitoring akan langsung Naik Kelas.
              </p>
            )}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              {INDICATORS.map((ind) => (
                <div
                  key={ind.flag}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{ind.label}</p>
                    <p className="truncate text-xs text-slate-400">{ind.description}</p>
                  </div>
                  <IndicatorSwitch
                    on={criteria[ind.flag]}
                    onToggle={() => updateField(ind.flag, !criteria[ind.flag])}
                    label={ind.label}
                  />
                </div>
              ))}
            </div>
          </div>

          {TIERS.map((tier) => {
            const isTopBadge = tier.key === "platinum";

            return (
              <div
                key={tier.key}
                className={`rounded-xl border p-5 transition-colors duration-300 ${
                  isTopBadge
                    ? "border-purple-200/60 bg-purple-50/50 dark:border-purple-800/40 dark:bg-purple-950/20"
                    : "border-slate-200 bg-slate-50 dark:border-white/[0.06] dark:bg-white/[0.02]"
                }`}
              >
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center">
                    {tier.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
                      {tier.tagLabel && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tier.tagBg} ${tier.tagText}`}>
                          {tier.tagLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                  </div>
                </div>

                {/* Fields */}
                {tier.fields && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
                    {tier.fields.map((field) => {
                      const active = criteria[field.flag];
                      return (
                        <div key={field.key} className={active ? undefined : "opacity-50"}>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <div className="flex items-center gap-1">
                            {field.prefix && <span className="text-sm text-slate-400">{field.prefix}</span>}
                            <input
                              type="text"
                              inputMode="numeric"
                              disabled={!active}
                              value={formatDisplayNumber(criteria[field.key] as number)}
                              onChange={(e) => updateField(field.key, parseFormattedNumber(e.target.value))}
                              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:cursor-not-allowed dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white"
                            />
                          </div>
                          {field.suffix && (
                            <p className="mt-1 text-xs text-slate-400">{field.suffix}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pemula info */}
                {tier.key === "pemula" && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Badge ini diberikan otomatis ketika UMKM sudah memiliki minimal 1 kunjungan monitoring. Tidak perlu dikonfigurasi.
                  </p>
                )}
              </div>
            );
          })}

          {/* Ringkasan */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 transition-colors duration-300 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Ringkasan Kriteria</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <SeedlingIcon className="h-3 w-3" /> Pemula
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Minimal 1 kunjungan monitoring — otomatis
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <SilverMedalIcon className="h-3 w-3" /> Tumbuh
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {tierSummary("silver")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  <GoldMedalIcon className="h-3 w-3" /> Berkembang
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {tierSummary("gold")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                  <DiamondIcon className="h-3 w-3" /> Naik Kelas
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {tierSummary("platinum")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
