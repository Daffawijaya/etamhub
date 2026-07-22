"use client";

import { useMemo, useState } from "react";

import UmkmSearch from "../UmkmSearch";
import UmkmFilters from "../UmkmFilters";
import UmkmTable from "../UmkmTable";
import UmkmPagination from "./UmkmPagination";

interface Props {
  data: any[];
}

export default function UmkmDataTable({ data }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nama");
  const [kecamatan, setKecamatan] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 10;

  const kecamatanOptions = useMemo(() => {
    return [
      "all",
      ...new Set(data.map((item) => item.kecamatan).filter(Boolean)),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (search) {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter kecamatan
    if (kecamatan !== "all") {
      result = result.filter(
        (item) => item.kecamatan === kecamatan,
      );
    }

    // Sorting
    if (sort === "nama") {
      result.sort((a, b) =>
        a.nama.localeCompare(b.nama),
      );
    }

    if (sort === "terbaru") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [data, search, sort, kecamatan]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice(
    (page - 1) * limit,
    page * limit,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Data UMKM
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Kelola data UMKM terdaftar
            </p>
          </div>


          <div className="flex items-center gap-3">
            <UmkmSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />

            <UmkmFilters
              sort={sort}
              kecamatan={kecamatan}
              kecamatanOptions={kecamatanOptions}
              onSortChange={(value) => {
                setSort(value ?? "nama");
                setPage(1);
              }}
              onKecamatanChange={(value) => {
                setKecamatan(value ?? "all");
                setPage(1);
              }}
            />
          </div>

        </div>
      </div>


      {/* Table */}
      <div className="p-0">
        <UmkmTable data={paginatedData} />

        <UmkmPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(value) => {
            setPage(value);
          }}
        />
      </div>

    </div>
  );
}