import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";
import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;
}

export default function SocialSection({ form, setForm }: Props) {
  function handleChange(name: keyof UmkmFormData, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
          required
          name="whatsapp"
          placeholder="WhatsApp*"
          type="tel"
          value={form.whatsapp}
          pattern="(08|628)[0-9]{8,11}"
          maxLength={13}
          onChange={(e) =>
            handleChange(
              "whatsapp",
              e.target.value.replace(/\D/g, "").slice(0, 13),
            )
          }
        />

        <FormField
          name="instagram"
          placeholder="Instagram"
          value={form.instagram}
          onChange={(e) => handleChange("instagram", e.target.value)}
        />

        <FormField
          name="facebook"
          placeholder="Facebook URL"
          value={form.facebook}
          onChange={(e) => handleChange("facebook", e.target.value)}
        />

        <FormField
          name="tiktok"
          placeholder="TikTok"
          value={form.tiktok}
          onChange={(e) => handleChange("tiktok", e.target.value)}
        />
      </div>
    </FormSection>
  );
}
