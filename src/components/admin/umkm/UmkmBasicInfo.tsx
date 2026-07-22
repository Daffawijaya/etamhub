"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UmkmFormData } from "./types";

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function UmkmBasicInfo({ form, setForm }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informasi UMKM</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Nama UMKM</Label>

          <Input
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Pemilik</Label>

          <Input
            value={form.pemilik}
            onChange={(e) =>
              setForm({
                ...form,
                pemilik: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Kategori</Label>

          <Input
            value={form.kategori}
            onChange={(e) =>
              setForm({
                ...form,
                kategori: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Subkategori</Label>

          <Input
            value={form.subkategori}
            onChange={(e) =>
              setForm({
                ...form,
                subkategori: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Deskripsi</Label>

        <Textarea
          rows={6}
          value={form.deskripsi}
          onChange={(e) =>
            setForm({
              ...form,
              deskripsi: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
