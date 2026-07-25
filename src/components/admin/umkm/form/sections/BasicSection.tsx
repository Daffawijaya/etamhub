import FormField from "../ui/FormField";
import FormSection from "../ui/FormSection";

import KategoriSelect from "../KategoriSelect";
import SubkategoriSelect from "../SubkategoriSelect";

import { UmkmFormData } from "../types";

interface Props {
  form: UmkmFormData;

  setForm: React.Dispatch<React.SetStateAction<UmkmFormData>>;

  subkategoriLainnya: string;

  setSubkategoriLainnya: React.Dispatch<React.SetStateAction<string>>;
}

export default function BasicSection({
  form,
  setForm,
  subkategoriLainnya,
  setSubkategoriLainnya,
}: Props) {
  function change(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <FormSection title="Informasi UMKM">
      <div
        className="
grid
md:grid-cols-2
gap-4
"
      >
        <FormField
          name="nama"
          placeholder="Nama UMKM"
          value={form.nama}
          onChange={change}
        />

        <FormField
          name="pemilik"
          placeholder="Nama Pemilik"
          value={form.pemilik}
          onChange={change}
        />

        <div
          className="
md:col-span-2
grid
md:grid-cols-2
gap-4
"
        >
          <KategoriSelect
            value={form.kategori}
            onChange={(value) => {
              setForm((prev) => ({
                ...prev,

                kategori: value,

                subkategori: "",
              }));

              setSubkategoriLainnya("");
            }}
          />

          <div>
            <SubkategoriSelect
              kategori={form.kategori}
              value={form.subkategori}
              onChange={(value) => {
                setForm((prev) => ({
                  ...prev,

                  subkategori: value,
                }));
              }}
            />

            {form.subkategori === "Lainnya" && (
              <FormField
                name="subkategoriLainnya"
                placeholder="Subkategori baru"
                value={subkategoriLainnya}
                onChange={(e) => setSubkategoriLainnya(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <textarea
        name="deskripsi"
        placeholder="Deskripsi UMKM"
        value={form.deskripsi}
        onChange={change}
        className="
w-full
h-36
rounded-xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-dark
px-4
py-3
text-sm
outline-none
focus:border-[#1184CA]
"
      />
    </FormSection>
  );
}
