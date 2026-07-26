"use client";

import { useState, useEffect, useCallback } from "react";
import UmkmSearch from "../UmkmSearch";
import UmkmFilters from "../UmkmFilters";
import UmkmTable from "../UmkmTable";
import UmkmPagination from "./UmkmPagination";
import UmkmTableHeaderActions from "./UmkmTableHeaderActions";

interface Props {
  limit?: number;
}

export default function UmkmDataTable({ limit = 10 }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nama");
  const [kecamatan, setKecamatan] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [umkms, setUmkms] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchUmkms = useCallback(async () => {
    const params = new URLSearchParams({
      mode: "admin",
      page: String(page),
      limit: String(limit),
      sort,
      order: sort === "nama" ? "asc" : "desc",
    });

    if (search) params.append("search", search);
    if (kecamatan !== "all") params.append("kecamatan", kecamatan);
    if (kategori !== "all") params.append("kategori", kategori);
    if (status !== "all") params.append("status", status);

    const res = await fetch(`/api/umkm?${params}`);

    const result = await res.json();

    setUmkms(result.data ?? []);
    setTotal(result.total ?? 0);

    setKecamatanOptions(["all", ...(result.filters?.kecamatan ?? [])]);

    setKategoriOptions(["all", ...(result.filters?.kategori ?? [])]);
  }, [page, limit, search, sort, kecamatan, kategori, status]);
  useEffect(() => {
    fetchUmkms();
  }, [fetchUmkms]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
  
        bg-white

        dark:bg-dark-card
        transition-colors
        duration-300
      "
    >
      {/* Header */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                transition-colors
                duration-300
              "
            >
              Data UMKM
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
                transition-colors
                duration-300
              "
            >
              Kelola data UMKM terdaftar
            </p>
          </div>

          <UmkmTableHeaderActions />
        </div>

        <div className="flex items-center justify-between pt-4">
          <UmkmSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <UmkmFilters
            kecamatanOptions={kecamatanOptions}
            kategoriOptions={kategoriOptions}
            kecamatan={kecamatan}
            kategori={kategori}
            sort={sort}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            onKecamatanChange={(value) => {
              setKecamatan(value);
              setPage(1);
            }}
            onKategoriChange={(value) => {
              setKategori(value);
              setPage(1);
            }}
            onSortChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-0">
        <UmkmTable
          data={umkms}
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

        <UmkmPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
