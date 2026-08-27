/**
 * Monitoring badge system for UMKM
 *
 * Criteria for each level:
 * - Bronze: Started monitoring (at least 1 monitoring visit)
 * - Silver: Omzet naik ≥20% ATAU tenaga kerja bertambah
 * - Gold: Omzet naik ≥50% DAN legalitas bertambah (halal/pirt/haki)
 * - Platinum: Omzet naik ≥100% DAN tenaga kerja ≥2x lipat DAN sosmed aktif (≥2 platform)
 */

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

export interface BadgeResult {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
  label: string;
  color: string;
  bgColor: string;
  description: string;
  criteria: {
    omzetIncrease: number | null; // percentage
    tkChange: number | null; // absolute
    legalitasAdded: number; // count of new legalitas
    sosmedCount: number; // active social media platforms
    monitoringCount: number;
  };
}

const BADGE_CONFIG = {
  none: {
    label: "",
    color: "text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800",
    description: "Belum ada monitoring",
  },
  bronze: {
    label: "🥉 Bronze",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    description: "Mulai aktif monitoring",
  },
  silver: {
    label: "🥈 Silver",
    color: "text-slate-600 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700/30",
    description: "Perkembangan positif",
  },
  gold: {
    label: "🥇 Gold",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    description: "Pertumbuhan signifikan",
  },
  platinum: {
    label: "💎 Platinum",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    description: "UMKM Naik Kelas!",
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

function calcPercentageChange(initial: number | null, latest: number | null): number | null {
  if (!initial || initial === 0 || latest === null) return null;
  return Math.round(((latest - initial) / initial) * 100);
}

export function calculateBadge(
  initial: MonitoringData,
  latest: MonitoringData | null,
  monitoringCount: number,
): BadgeResult {
  if (monitoringCount === 0 || !latest) {
    return { level: "none", ...BADGE_CONFIG.none, criteria: { omzetIncrease: null, tkChange: null, legalitasAdded: 0, sosmedCount: 0, monitoringCount: 0 } };
  }

  const omzetIncrease = calcPercentageChange(initial.omzet, latest.omzet);
  const tkChange =
    latest.jumlah_tenaga_kerja !== null && initial.jumlah_tenaga_kerja !== null
      ? latest.jumlah_tenaga_kerja - initial.jumlah_tenaga_kerja
      : null;
  const legalitasAdded = Math.max(0, countLegalitas(latest) - countLegalitas(initial));
  const sosmedCount = countSosmed(latest);

  const criteria = {
    omzetIncrease,
    tkChange,
    legalitasAdded,
    sosmedCount,
    monitoringCount,
  };

  // Platinum: omzet ≥100% AND tk ≥2x AND sosmed ≥2
  if (
    omzetIncrease !== null &&
    omzetIncrease >= 100 &&
    tkChange !== null &&
    initial.jumlah_tenaga_kerja !== null &&
    tkChange >= initial.jumlah_tenaga_kerja &&
    sosmedCount >= 2
  ) {
    return { level: "platinum", ...BADGE_CONFIG.platinum, criteria };
  }

  // Gold: omzet ≥50% AND legalitas added
  if (
    omzetIncrease !== null &&
    omzetIncrease >= 50 &&
    legalitasAdded > 0
  ) {
    return { level: "gold", ...BADGE_CONFIG.gold, criteria };
  }

  // Silver: omzet ≥20% OR tk bertambah
  if (
    (omzetIncrease !== null && omzetIncrease >= 20) ||
    (tkChange !== null && tkChange > 0)
  ) {
    return { level: "silver", ...BADGE_CONFIG.silver, criteria };
  }

  // Bronze: at least 1 monitoring
  return { level: "bronze", ...BADGE_CONFIG.bronze, criteria };
}

export { BADGE_CONFIG };
