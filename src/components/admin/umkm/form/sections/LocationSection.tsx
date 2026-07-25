import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";

import KecamatanSelect from "../KecamatanSelect";

import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function LocationSection({ form, setForm }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Lokasi">
      <div
        className="
grid
md:grid-cols-2
gap-4
"
      >
        <KecamatanSelect
          value={form.kecamatan}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,

              kecamatan: value,
            }))
          }
        />

        <FormField
          name="alamat"
          placeholder="Alamat Lengkap"
          value={form.alamat}
          onChange={handleChange}
        />

        <FormField
          name="lat"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
        />

        <FormField
          name="lng"
          placeholder="Longitude"
          value={form.lng}
          onChange={handleChange}
        />
      </div>
    </FormSection>
  );
}
