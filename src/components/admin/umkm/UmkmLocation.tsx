"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UmkmFormData } from "./types";

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<
    React.SetStateAction<UmkmFormData>
  >;
}

export default function UmkmLocation({
  form,
  setForm,
}: Props) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-lg">
            Lokasi UMKM
          </h2>
        </div>

        <div>
          <Label>Kecamatan</Label>

          <Input
            value={form.kecamatan}
            onChange={(e) =>
              setForm({
                ...form,
                kecamatan: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Alamat</Label>

          <Input
            value={form.alamat}
            onChange={(e) =>
              setForm({
                ...form,
                alamat: e.target.value,
              })
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>

            <Input
              value={form.lat}
              onChange={(e) =>
                setForm({
                  ...form,
                  lat: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Longitude</Label>

            <Input
              value={form.lng}
              onChange={(e) =>
                setForm({
                  ...form,
                  lng: e.target.value,
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}