import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";
import KBLISelect from "../ui/KBLISelect";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function BusinessSection({ form, setForm }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Legalitas Usaha">
      <div
        className=" flex w-full items-start
grid
md:grid-cols-2
gap-4 
"
      >
        <FormField
          name="nib"
          placeholder="NIB"
          value={form.nib}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              nib: e.target.value.replace(/\D/g, "").slice(0, 13),
            }))
          }
        />

        <KBLISelect
          value={form.kbli}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              kbli: value,
            }))
          }
        />

        <FormField
          name="npwp"
          placeholder="NPWP"
          value={form.npwp}
          onChange={handleChange}
        />

        <FormField
          name="halal"
          placeholder="Sertifikat Halal"
          value={form.halal}
          onChange={handleChange}
        />

        <FormField
          name="pirt"
          placeholder="PIRT"
          value={form.pirt}
          onChange={handleChange}
        />

        <FormField
          name="haki"
          placeholder="HaKI"
          value={form.haki}
          onChange={handleChange}
        />
      </div>
    </FormSection>
  );
}
