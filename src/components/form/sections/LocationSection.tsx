"use client";

import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";
import KecamatanSelect from "../KecamatanSelect";
import dynamic from "next/dynamic";
import { UmkmFormData } from "../types";
const LocationPicker = dynamic(
  () => import("../map/LocationPicker"),
  {
    ssr: false,
  },
);

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
  kecamatanOptions: string[];
}

export default function LocationSection({
  form,
  setForm,
  kecamatanOptions,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Lokasi">
      <div className="relative z-10 grid md:grid-cols-2 gap-4">
        <KecamatanSelect
          required
          options={kecamatanOptions}
          value={form.kecamatan}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              kecamatan: value,
            }))
          }
        />

        <FormField
          required
          name="alamat"
          placeholder="Alamat Lengkap*"
          value={form.alamat}
          onChange={handleChange}
        />

        <FormField
          required
          name="lat"
          placeholder="Latitude*"
          value={form.lat}
          onChange={handleChange}
        />

        <FormField
          required
          name="lng"
          placeholder="Longitude*"
          value={form.lng}
          onChange={handleChange}
        />
      </div>

      <div className="mt-6">
        <LocationPicker
          latitude={form.lat}
          longitude={form.lng}
          onSave={(lat, lng) =>
            setForm((prev) => ({
              ...prev,
              lat: lat.toString(),
              lng: lng.toString(),
            }))
          }
        />
      </div>
    </FormSection>
  );
}
