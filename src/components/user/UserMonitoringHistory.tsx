"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

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

interface UMKMData {
  jumlah_tenaga_kerja: number | null;
  omzet: number | null;
  nib: string | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  kbli: string[] | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

function formatRupiah(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
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
      {diff > 0 ? (
        <TrendingUp size={10} />
      ) : diff < 0 ? (
        <TrendingDown size={10} />
      ) : (
        <Minus size={10} />
      )}
      {format === "rupiah"
        ? formatRupiah(Math.abs(diff))
        : Math.abs(diff)}
    </span>
  );
}

interface Props {
  umkmId: string;
  umkm: UMKMData;
}

export default function UserMonitoringHistory({ umkmId, umkm }: Props) {
  const [monitorings, setMonitorings] = useState<MonitoringEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/user/umkm/${umkmId}/monitoring`);
        const data = await res.json();
        if (res.ok) {
          setMonitorings(data.monitorings ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [umkmId]);

  function getEntryData(entry: MonitoringEntry | null) {
    if (!entry) {
      return {
        omzet: umkm.omzet,
        jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja,
        halal: umkm.halal,
        pirt: umkm.pirt,
        haki: umkm.haki,
        nib: umkm.nib,
        instagram: umkm.instagram,
        facebook: umkm.facebook,
        tiktok: umkm.tiktok,
      };
    }
    return {
      omzet: entry.omzet ?? umkm.omzet,
      jumlah_tenaga_kerja: entry.jumlah_tenaga_kerja ?? umkm.jumlah_tenaga_kerja,
      halal: entry.halal ?? umkm.halal,
      pirt: entry.pirt ?? umkm.pirt,
      haki: entry.haki ?? umkm.haki,
      nib: entry.nib ?? umkm.nib,
      instagram: entry.instagram ?? umkm.instagram,
      facebook: entry.facebook ?? umkm.facebook,
      tiktok: entry.tiktok ?? umkm.tiktok,
    };
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-sm text-slate-500">Memuat data monitoring...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.06]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Riwayat Monitoring
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {monitorings.length} kali monitoring
          {monitorings.length > 0
            ? ` · Terakhir: ${formatDateTime(monitorings[0].created_at)}`
            : ""}
        </p>
      </div>

      {monitorings.length === 0 ? (
        <div className="p-8 text-center">
          <FileText
            size={32}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
          />
          <p className="text-sm text-slate-400">Belum ada riwayat monitoring</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
          {monitorings.map((entry, idx) => {
            const isExpanded = expandedEntry === entry.id;
            const prevEntry = monitorings[idx + 1];
            const entryData = getEntryData(entry);

            const legalItems = [
              entryData.nib && { label: "NIB", value: entryData.nib },
              umkm.kbli &&
                umkm.kbli.length > 0 && {
                  label: "KBLI",
                  value: umkm.kbli.join(", "),
                },
              entryData.halal && { label: "Halal", value: entryData.halal },
              entryData.pirt && { label: "PIRT", value: entryData.pirt },
              entryData.haki && { label: "HAKI", value: entryData.haki },
            ].filter(Boolean) as { label: string; value: string }[];

            const sosmedItems = [
              entryData.instagram && {
                label: "Instagram",
                value: entryData.instagram,
              },
              entryData.facebook && {
                label: "Facebook",
                value: entryData.facebook,
              },
              entryData.tiktok && {
                label: "TikTok",
                value: entryData.tiktok,
              },
            ].filter(Boolean) as { label: string; value: string }[];

            return (
              <div key={entry.id} className="px-6 py-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          idx === 0
                            ? "bg-emerald-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                      {idx === 0 && (
                        <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-40" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Monitoring #{monitorings.length - idx}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(entry.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {prevEntry && (
                      <div className="flex items-center gap-2">
                        <TrendBadge
                          current={entry.omzet}
                          previous={prevEntry.omzet}
                          format="rupiah"
                        />
                        <TrendBadge
                          current={entry.jumlah_tenaga_kerja}
                          previous={prevEntry.jumlah_tenaga_kerja}
                        />
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setExpandedEntry(isExpanded ? null : entry.id)
                      }
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-2 ml-5.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500">
                    TK:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {entryData.jumlah_tenaga_kerja ?? "-"}
                    </span>
                  </span>
                  <span className="text-slate-500">
                    Omzet:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatRupiah(entryData.omzet)}
                    </span>
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    Legalitas:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {((entryData.nib ||
                        (umkm.kbli && umkm.kbli.length > 0))
                        ? 1
                        : 0) +
                        (entryData.halal ? 1 : 0) +
                        (entryData.pirt ? 1 : 0) +
                        (entryData.haki ? 1 : 0)}
                    </span>
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    Sosmed:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {(entryData.instagram ? 1 : 0) +
                        (entryData.facebook ? 1 : 0) +
                        (entryData.tiktok ? 1 : 0)}
                    </span>
                  </span>
                </div>

                {/* Expanded details */}
                <div
                  className={`ml-5.5 grid transition-all duration-300 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="mt-3 rounded-lg bg-slate-50 p-4 dark:bg-white/[0.02] space-y-3">
                      {/* Legalitas */}
                      {legalItems.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1.5">
                            Legalitas
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {legalItems.map((item) => {
                              const prevData = prevEntry
                                ? getEntryData(prevEntry)
                                : umkm;
                              const prevVal =
                                item.label === "NIB"
                                  ? prevData.nib
                                  : item.label === "Halal"
                                    ? prevData.halal
                                    : item.label === "PIRT"
                                      ? prevData.pirt
                                      : item.label === "HAKI"
                                        ? prevData.haki
                                        : null;
                              const isNew = !prevVal;
                              return (
                                <span
                                  key={item.label}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    isNew
                                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                  }`}
                                >
                                  {isNew ? "✓" : "•"} {item.label}{" "}
                                  <span className="opacity-60">
                                    {item.value}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sosmed */}
                      {sosmedItems.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1.5">
                            Sosmed
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {sosmedItems.map((item) => {
                              const prevData = prevEntry
                                ? getEntryData(prevEntry)
                                : umkm;
                              const prevVal =
                                item.label === "Instagram"
                                  ? prevData.instagram
                                  : item.label === "Facebook"
                                    ? prevData.facebook
                                    : prevData.tiktok;
                              const isNew = !prevVal;
                              return (
                                <span
                                  key={item.label}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    isNew
                                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                  }`}
                                >
                                  {isNew ? "✓" : "•"} {item.label}{" "}
                                  <span className="opacity-60">
                                    {item.value}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Catatan */}
                      {(entry.kebutuhan_utama || entry.catatan) && (
                        <div className="border-t border-slate-100 dark:border-white/[0.06] pt-2.5">
                          {entry.kebutuhan_utama && (
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Kebutuhan:</span>{" "}
                              {entry.kebutuhan_utama}
                            </p>
                          )}
                          {entry.catatan && (
                            <p className="text-xs text-slate-500 mt-1">
                              <span className="font-medium">Catatan:</span>{" "}
                              {entry.catatan}
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
  );
}
