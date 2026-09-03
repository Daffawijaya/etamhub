"use client";

import { useState, useEffect, useCallback } from "react";
import UmkmSearch from "../UmkmSearch";
import UmkmFilters from "../UmkmFilters";
import UmkmTable from "../UmkmTable";
import UmkmPagination from "./UmkmPagination";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface Props {
  limit?: number;
}

interface AppliedFilters {
  search: string;
  sort: string;
  kecamatan: string;
  kategori: string;
  status: string;
}

const DEFAULT_FILTERS: AppliedFilters = {
  search: "",
  sort: "terbaru",
  kecamatan: "all",
  kategori: "all",
  status: "all",
};

export default function UmkmDataTable({ limit = 10 }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [umkms, setUmkms] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [applied, setApplied] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const { canUpdate, canDelete } = useRolePermissions(userRole);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserRole(data.role))
      .catch(() => {});
  }, []);

  const fetchUmkms = useCallback(async () => {
    const params = new URLSearchParams({
      mode: "admin",
      page: String(page),
      limit: String(limit),
      sort: applied.sort,
      order: applied.sort === "terbaru" ? "desc" : applied.sort === "nama" ? "asc" : "desc",
    });

    if (applied.search) params.append("search", applied.search);
    if (applied.kecamatan !== "all") params.append("kecamatan", applied.kecamatan);
    if (applied.kategori !== "all") params.append("kategori", applied.kategori);
    if (applied.status !== "all") params.append("status", applied.status);

    const res = await fetch(`/api/umkm?${params}`);
    const result = await res.json();

    setUmkms(result.data ?? []);
    setTotal(result.total ?? 0);
    setKecamatanOptions(["all", ...(result.filters?.kecamatan ?? [])]);
    setKategoriOptions(["all", ...(result.filters?.kategori ?? [])]);
  }, [page, limit, applied]);

  useEffect(() => {
    fetchUmkms();
  }, [fetchUmkms]);

  const totalPages = Math.ceil(total / limit);

  // Search applies immediately
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setApplied((f) => ({ ...f, search: value }));
    setPage(1);
  }, []);

  const handleApply = useCallback(() => {
    setApplied({ ...draft, search });
    setPage(1);
  }, [draft, search]);

  const handleReset = useCallback(() => {
    const reset: AppliedFilters = { ...DEFAULT_FILTERS, search };
    setDraft(reset);
    setApplied(reset);
    setPage(1);
  }, [search]);

  return (
    <div className="overflow-visible rounded-2xl bg-white dark:bg-dark-card transition-colors duration-300">
      {/* Header */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Data UMKM
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Kelola data UMKM terdaftar
            </p>
          </div>

          {/* Search + Filter — right side */}
          <div className="flex items-center gap-2">
            <UmkmSearch value={search} onChange={handleSearch} />
            <UmkmFilters
              kecamatanOptions={kecamatanOptions}
              kategoriOptions={kategoriOptions}
              kecamatan={draft.kecamatan}
              kategori={draft.kategori}
              sort={draft.sort}
              status={draft.status}
              onStatusChange={(v) => setDraft((f) => ({ ...f, status: v }))}
              onKecamatanChange={(v) => setDraft((f) => ({ ...f, kecamatan: v }))}
              onKategoriChange={(v) => setDraft((f) => ({ ...f, kategori: v }))}
              onSortChange={(v) => setDraft((f) => ({ ...f, sort: v }))}
              onApply={handleApply}
              onReset={handleReset}
            />

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-0">
        <UmkmTable
          data={umkms}
          canUpdate={canUpdate}
          canDelete={canDelete}
          columns={{
            gambar: true,
            nama: true,
            pemilik: true,
            whatsapp: true,
            kategori: true,
            kecamatan: true,
            createdAt: false,
            status: true,
            action: true,
          }}
          onStatusChanged={fetchUmkms}
        />
        <UmkmPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
