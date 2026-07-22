"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Umkm = {
  id: number;
  nama: string;
  kategori: string;
  kecamatan: string;
};

export default function AdminUmkmPage() {
  const [umkms, setUmkms] = useState<Umkm[]>([]);

  async function getUmkm() {
    const res = await fetch("/api/umkm");
    const data = await res.json();

    setUmkms(data);
  }

  async function deleteUmkm(id: number) {
    const yakin = confirm("Yakin ingin menghapus UMKM ini?");

    if (!yakin) return;

    await fetch(`/api/umkm/${id}`, {
      method: "DELETE",
    });

    getUmkm();
  }

  useEffect(() => {
    getUmkm();
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data UMKM</h1>

          <p className="text-muted-foreground">Kelola seluruh data UMKM</p>
        </div>

        <Link href="/admin/tambah">
          <Button>Tambah UMKM</Button>
        </Link>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama UMKM</TableHead>

                <TableHead>Kategori</TableHead>

                <TableHead>Kecamatan</TableHead>

                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {umkms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Belum ada data UMKM
                  </TableCell>
                </TableRow>
              ) : (
                umkms.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nama}</TableCell>

                    <TableCell>{u.kategori}</TableCell>

                    <TableCell>{u.kecamatan}</TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/edit/${u.id}`}>
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUmkm(u.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
