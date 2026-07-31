import FormField from "../ui/FormField";
import FormSelect from "../ui/FormSelect";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

const jenisKelamin = ["Laki-laki", "Perempuan"] as const;

export default function OwnerSection({ form, setForm }: Props) {
  function handleChange(name: keyof UmkmFormData, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <FormSection title="Data Pemilik">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          name="nik"
          placeholder="NIK*"
          value={form.nik}
          required
          pattern="[0-9]{16}"
          maxLength={16}
          inputMode="numeric"
          onChange={(e) =>
            handleChange("nik", e.target.value.replace(/\D/g, "").slice(0, 16))
          }
        />

        <FormSelect
          name="jenis_kelamin"
          value={form.jenis_kelamin}
          options={jenisKelamin}
          placeholder="Pilih Jenis Kelamin*"
          required
          onChange={(value) => handleChange("jenis_kelamin", value)}
        />

        <FormField
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
    </FormSection>
  );
}
