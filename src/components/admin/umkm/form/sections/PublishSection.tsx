import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function PublishSection({ form, setForm }: Props) {
  return (
    <FormSection title="Status Publikasi">
      <label
        className="
flex
items-center
gap-3
cursor-pointer
"
      >
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,

              published: e.target.checked,
            }))
          }
        />

        <span
          className="
text-sm
text-slate-700
dark:text-slate-300
"
        >
          Tampilkan UMKM di katalog
        </span>
      </label>
    </FormSection>
  );
}
