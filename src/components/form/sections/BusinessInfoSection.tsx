import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;
  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
  role?: "admin" | "user";
}

export default function BusinessInfoSection({ form, setForm, role = "admin" }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Informasi Usaha">
      <div className="grid md:grid-cols-1 gap-4">
        <FormField
          name="tahun_mulai_usaha"
          placeholder="Tahun Mulai Usaha"
          type="number"
          value={form.tahun_mulai_usaha}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              tahun_mulai_usaha: e.target.value.replace(/\D/g, "").slice(0, 4),
            }))
          }
        />
      </div>
    </FormSection>
  );
}
