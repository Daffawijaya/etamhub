import FormField from "../ui/FormField";
import FormSelect from "../ui/FormSelect";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
  role?: "admin" | "user";
}

const jenisKelamin = ["Laki-laki", "Perempuan"] as const;

export default function OwnerSection({ form, setForm, role = "admin" }: Props) {
  function handleChange(name: keyof UmkmFormData, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <FormSection title="Data Pemilik">
      <div className={role === "user" ? "grid md:grid-cols-1 gap-4" : "grid md:grid-cols-2 gap-4"}>
        {role !== "user" && (
          <FormField
            name="nik"
            placeholder="NIK*"
            value={form.nik}
            readOnly
            required
            pattern="[0-9]{16}"
            maxLength={16}
            inputMode="numeric"
          />
        )}

        <FormSelect
          name="jenis_kelamin"
          value={form.jenis_kelamin}
          options={jenisKelamin}
          placeholder="Pilih Jenis Kelamin*"
          required
          onChange={(value) => handleChange("jenis_kelamin", value)}
        />

        {role !== "user" && (
          <FormField
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            readOnly
          />
        )}
      </div>
    </FormSection>
  );
}
