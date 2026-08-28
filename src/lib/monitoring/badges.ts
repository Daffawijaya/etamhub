/**
 * Monitoring badge system for UMKM
 *
 * Criteria are configurable via badge_criteria table.
 * Uses absolute/nominal values from MONITORING DATA ONLY:
 * - 🥉 Pemula: Started monitoring (at least 1 visit)
 * - 🌱 Tumbuh: Omzet ≥ X, TK ≥ Y
 * - 🥈 Berkembang: Omzet ≥ X, TK ≥ Y, Legalitas ≥ Z, Sosmed ≥ W
 * - 💎 Naik Kelas: Omzet ≥ X, TK ≥ Y, Legalitas ≥ Z, Sosmed ≥ W (top tier)
 *
 * IMPORTANT: Badges only appear for UMKM that have been monitored.
 * Self-reported UMKM data does NOT count for badge calculation.
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface MonitoringData {
  omzet: number | null;
  jumlah_tenaga_kerja: number | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

export interface BadgeCriteria {
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

// Display names mapping internal levels to user-facing labels
export const BADGE_LEVEL_NAMES = {
  none: "",
  bronze: "🥉 Pemula",
  silver: "🌱 Tumbuh",
  gold: "🥈 Berkembang",
  platinum: "💎 Naik Kelas",
} as const;

export interface BadgeResult {
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

const BADGE_STYLES = {
  none: {
    label: "",
    color: "text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800",
  },
  bronze: {
    label: "🥉 Pemula",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  silver: {
    label: "🌱 Tumbuh",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  gold: {
    label: "🥈 Berkembang",
    color: "text-slate-600 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700/30",
  },
  platinum: {
    label: "💎 Naik Kelas",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
} as const;

function countSosmed(data: MonitoringData): number {
  let count = 0;
  if (data.instagram) count++;
  if (data.facebook) count++;
  if (data.tiktok) count++;
  return count;
}

function countLegalitas(data: MonitoringData): number {
  let count = 0;
  if (data.halal) count++;
  if (data.pirt) count++;
  if (data.haki) count++;
  return count;
}

const DEFAULT_CRITERIA: BadgeCriteria = {
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
  silver_label: "🌱 Tumbuh",
  gold_label: "🥈 Berkembang",
  platinum_label: "💎 Naik Kelas",
};

// Fetch badge criteria from database
export async function getBadgeCriteria(): Promise<BadgeCriteria> {
  try {
    const { data, error } = await supabaseAdmin
      .from("badge_criteria")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return DEFAULT_CRITERIA;
    }

    return {
      silver_omzet_min: data.silver_omzet_min ?? DEFAULT_CRITERIA.silver_omzet_min,
      silver_tk_min: data.silver_tk_min ?? DEFAULT_CRITERIA.silver_tk_min,
      silver_legalitas_min: data.silver_legalitas_min ?? DEFAULT_CRITERIA.silver_legalitas_min,
      silver_sosmed_min: data.silver_sosmed_min ?? DEFAULT_CRITERIA.silver_sosmed_min,
      gold_omzet_min: data.gold_omzet_min ?? DEFAULT_CRITERIA.gold_omzet_min,
      gold_tk_min: data.gold_tk_min ?? DEFAULT_CRITERIA.gold_tk_min,
      gold_legalitas_min: data.gold_legalitas_min ?? DEFAULT_CRITERIA.gold_legalitas_min,
      gold_sosmed_min: data.gold_sosmed_min ?? DEFAULT_CRITERIA.gold_sosmed_min,
      platinum_omzet_min: data.platinum_omzet_min ?? DEFAULT_CRITERIA.platinum_omzet_min,
      platinum_tk_min: data.platinum_tk_min ?? DEFAULT_CRITERIA.platinum_tk_min,
      platinum_legalitas_min: data.platinum_legalitas_min ?? DEFAULT_CRITERIA.platinum_legalitas_min,
      platinum_sosmed_min: data.platinum_sosmed_min ?? DEFAULT_CRITERIA.platinum_sosmed_min,
      silver_label: data.silver_label ?? DEFAULT_CRITERIA.silver_label,
      gold_label: data.gold_label ?? DEFAULT_CRITERIA.gold_label,
      platinum_label: data.platinum_label ?? DEFAULT_CRITERIA.platinum_label,
    };
  } catch {
    return DEFAULT_CRITERIA;
  }
}

// Check if data meets criteria
function meetsCriteria(
  data: MonitoringData,
  omzetMin: number,
  tkMin: number,
  legalitasMin: number,
  sosmedMin: number,
): boolean {
  const omzet = data.omzet ?? 0;
  const tk = data.jumlah_tenaga_kerja ?? 0;
  const legalitas = countLegalitas(data);
  const sosmed = countSosmed(data);

  return (
    omzet >= omzetMin &&
    tk >= tkMin &&
    legalitas >= legalitasMin &&
    sosmed >= sosmedMin
  );
}

// Synchronous version
export function calculateBadgeWithCriteria(
  _initial: MonitoringData,
  latest: MonitoringData | null,
  monitoringCount: number,
  config: BadgeCriteria,
): BadgeResult {
  // BADGE ONLY: Must have monitoring data. No monitoring = no badge.
  if (monitoringCount === 0 || !latest) {
    return {
      level: "none",
      ...BADGE_STYLES.none,
      description: "Belum ada monitoring",
      criteria: { omzet: null, tk: null, legalitas: 0, sosmed: 0, monitoringCount: 0 },
    };
  }

  const currentOmzet = latest.omzet ?? 0;
  const currentTk = latest.jumlah_tenaga_kerja ?? 0;
  const currentLegalitas = countLegalitas(latest);
  const currentSosmed = countSosmed(latest);

  const criteria = {
    omzet: currentOmzet,
    tk: currentTk,
    legalitas: currentLegalitas,
    sosmed: currentSosmed,
    monitoringCount,
  };

  // 💎 Naik Kelas: semua kriteria terpenuhi (top tier)
  if (
    meetsCriteria(
      latest,
      config.platinum_omzet_min,
      config.platinum_tk_min,
      config.platinum_legalitas_min,
      config.platinum_sosmed_min,
    )
  ) {
    return {
      level: "platinum",
      ...BADGE_STYLES.platinum,
      description: config.platinum_label,
      criteria,
    };
  }

  // 🥈 Berkembang: semua kriteria terpenuhi
  if (
    meetsCriteria(
      latest,
      config.gold_omzet_min,
      config.gold_tk_min,
      config.gold_legalitas_min,
      config.gold_sosmed_min,
    )
  ) {
    return {
      level: "gold",
      ...BADGE_STYLES.gold,
      description: config.gold_label,
      criteria,
    };
  }

  // 🌱 Tumbuh: semua kriteria terpenuhi
  if (
    meetsCriteria(
      latest,
      config.silver_omzet_min,
      config.silver_tk_min,
      config.silver_legalitas_min,
      config.silver_sosmed_min,
    )
  ) {
    return {
      level: "silver",
      ...BADGE_STYLES.silver,
      description: config.silver_label,
      criteria,
    };
  }

  // 🥉 Pemula: minimal sudah monitoring
  return {
    level: "bronze",
    ...BADGE_STYLES.bronze,
    description: "Mulai aktif monitoring",
    criteria,
  };
}

// Async version
export async function calculateBadge(
  initial: MonitoringData,
  latest: MonitoringData | null,
  monitoringCount: number,
): Promise<BadgeResult> {
  const config = await getBadgeCriteria();
  return calculateBadgeWithCriteria(initial, latest, monitoringCount, config);
}

export { BADGE_STYLES };
