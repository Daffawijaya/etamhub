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
      <div className={role === "user" ? "grid md:grid-cols-1 gap-4" : "grid md:grid-cols-3 gap-4"}>
        <FormField
          name="tahun_mulai_usaha"
          placeholder="Tahun Mulai Usaha"
          type="number"
          value={form.tahun_mulai_usaha}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              tahun_mulai_usaha: e.target.value
                .replace(/\D/g, "")
                .slice(0, 4),
            }))
          }
        />

        {role !== "user" && (
          <>
            <FormField
              name="jumlah_tenaga_kerja"
              placeholder="Jumlah Tenaga Kerja"
              type="number"
              value={form.jumlah_tenaga_kerja}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  jumlah_tenaga_kerja: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                }))
              }
            />

            <FormField
              name="omzet"
              placeholder="Omzet (Rp)"
              type="number"
              value={form.omzet}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  omzet: e.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </>
        )}
      </div>
    </FormSection>
  );
}
