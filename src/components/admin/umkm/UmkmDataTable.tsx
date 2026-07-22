"use client";

import { useMemo, useState } from "react";
import UmkmSearch from "../UmkmSearch";
import UmkmFilters from "../UmkmFilters";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    result = result.filter((item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()),
    );

    // Kecamatan
    if (kecamatan !== "all") {
      result = result.filter((item) => item.kecamatan === kecamatan);
    }

    // Sorting
    if (sort === "nama") {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    if (sort === "terbaru") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [data, search, sort, kecamatan]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <Card className="py-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Data UMKM
            </CardTitle>

            <CardDescription>Kelola data UMKM terdaftar</CardDescription>
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
      </CardHeader>

      <CardContent className="p-0">
        <UmkmTable data={paginatedData} />

        <UmkmPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}
