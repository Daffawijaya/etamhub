"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UmkmSearch from "../UmkmSearch";
import UmkmFilters from "../UmkmFilters";
import UmkmTable from "../UmkmTable";
import UmkmPagination from "./UmkmPagination";
import UmkmTableHeaderActions from "./UmkmTableHeaderActions";

interface Props {
  data: any[];
}

export default function UmkmDataTable({ data }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nama");
  const [kecamatan, setKecamatan] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const limit = 10;

  const kecamatanOptions = useMemo(() => {
    return [
      "all",
      ...new Set(data.map((item) => item.kecamatan).filter(Boolean)),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (kecamatan !== "all") {
      result = result.filter((item) => item.kecamatan === kecamatan);
    }

    if (kategori !== "all") {
      result = result.filter((item) => item.kategori === kategori);
    }

    if (sort === "nama") {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    if (sort === "terbaru") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return result;
  }, [data, search, sort, kecamatan, kategori]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

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
            sort={sort}
            kecamatan={kecamatan}
            kategori={kategori}
            kecamatanOptions={kecamatanOptions}
            onSortChange={(value) => {
              setSort(value ?? "nama");
              setPage(1);
            }}
            onKecamatanChange={(value) => {
              setKecamatan(value ?? "all");
              setPage(1);
            }}
            onKategoriChange={(value) => {
              setKategori(value ?? "all");
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-0">
        <UmkmTable
          data={paginatedData}
          onEdit={(item) => {
            router.push(`/admin/umkm/edit/${item.id}`);
          }}
        />

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
