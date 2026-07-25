import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function SocialSection({ form, setForm }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Kontak & Sosial Media">
      <div
        className="
        grid
        md:grid-cols-2
        gap-4
        "
      >
        <FormField
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
        />

        <FormField
          name="instagram"
          placeholder="Instagram"
          value={form.instagram}
          onChange={handleChange}
        />

        <FormField
          name="facebook"
          placeholder="Facebook URL"
          value={form.facebook}
          onChange={handleChange}
        />

        <FormField
          name="tiktok"
          placeholder="TikTok"
          value={form.tiktok}
          onChange={handleChange}
        />
      </div>
    </FormSection>
  );
}
