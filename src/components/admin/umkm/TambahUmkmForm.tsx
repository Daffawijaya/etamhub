"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import KategoriSelect from "./KategoriSelect";
import SubkategoriSelect from "./SubkategoriSelect";
import KecamatanSelect from "./KecamatanSelect";

const initialForm = {
  nama: "",
  pemilik: "",
  kategori: "",
  subkategori: "",
  deskripsi: "",
  kecamatan: "",
  alamat: "",
  lat: "",
  lng: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  tiktok: "",
};

export default function TambahUmkmForm() {
  const router = useRouter();
  const [subkategoriLainnya, setSubkategoriLainnya] = useState("");
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function uploadFile(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return data.url;
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setUploading(true);

    const uploadedImages: string[] = [];

    try {
      for (const file of images) {
        const url = await uploadFile(file);
        uploadedImages.push(url);
      }

      await fetch("/api/umkm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,

          subkategori:
            form.subkategori === "Lainnya"
              ? subkategoriLainnya
              : form.subkategori,

          gambar: uploadedImages,

          lat: Number(form.lat),
          lng: Number(form.lng),
        }),
      });

      router.push("/admin/umkm");
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="
      bg-white
      border border-slate-200
      rounded-2xl
      px-6 py-5
    "
    >
      <div className="mb-8">
        <h1
          className="
          text-2xl
          font-bold
          text-slate-900
        "
        >
          Tambah UMKM
        </h1>

        <p
          className="
          text-sm
          text-slate-500
          mt-1
        "
        >
          Tambahkan data UMKM baru ke katalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Informasi UMKM">
          <div
            className="
      grid
      md:grid-cols-2
      gap-4
    "
          >
            <Input
              name="nama"
              placeholder="Nama UMKM"
              value={form.nama}
              onChange={handleChange}
            />

            <Input
              name="pemilik"
              placeholder="Nama Pemilik"
              value={form.pemilik}
              onChange={handleChange}
            />

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div className="w-full">
                <KategoriSelect
                  value={form.kategori}
                  onChange={(value) => {
                    setForm({
                      ...form,
                      kategori: value,
                      subkategori: "",
                    });

                    setSubkategoriLainnya("");
                  }}
                />
              </div>

              <div className="w-full space-y-2">
                <SubkategoriSelect
                  kategori={form.kategori}
                  value={form.subkategori}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      subkategori: value,
                    })
                  }
                />

                {form.subkategori === "Lainnya" && (
                  <Input
                    name="subkategoriLainnya"
                    placeholder="Masukkan subkategori baru"
                    value={subkategoriLainnya}
                    onChange={(e) => setSubkategoriLainnya(e.target.value)}
                  />
                )}
              </div>
            </div>

            <KecamatanSelect
              value={form.kecamatan}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  kecamatan: value,
                }))
              }
            />

            <Input
              name="alamat"
              placeholder="Alamat"
              value={form.alamat}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="deskripsi"
            placeholder="Deskripsi UMKM"
            value={form.deskripsi}
            onChange={handleChange}
            className="
      w-full
      h-36
      rounded-xl
      border border-slate-200
      px-4 py-3
      text-sm
      outline-none
      focus:border-[#1184CA]
    "
          />
        </Section>

        <Section title="Lokasi">
          <div
            className="
            grid
            md:grid-cols-2
            gap-4
          "
          >
            <Input
              name="lat"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
            />

            <Input
              name="lng"
              placeholder="Longitude"
              value={form.lng}
              onChange={handleChange}
            />
          </div>
        </Section>

        <Section title="Kontak & Sosial Media">
          <div
            className="
            grid
            md:grid-cols-2
            gap-4
          "
          >
            {[
              ["whatsapp", "WhatsApp"],
              ["instagram", "Instagram"],
              ["facebook", "Facebook Url"],
              ["tiktok", "TikTok"],
            ].map(([name, placeholder]) => (
              <Input
                key={name}
                name={name}
                placeholder={placeholder}
                value={(form as any)[name]}
                onChange={handleChange}
              />
            ))}
          </div>
        </Section>

        <Section title="Gambar UMKM">
          <label
            className="
            flex
            items-center
            justify-center
            gap-2
            border
            border-dashed
            border-slate-300
            rounded-xl
            p-6
            cursor-pointer
            hover:bg-slate-50
          "
          >
            <Upload size={18} />

            <span className="text-sm">Upload gambar</span>

            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
            />
          </label>

          <div
            className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
          >
            {images.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="
      relative
      border
      rounded-xl
      overflow-hidden
    "
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="
        h-28
        w-full
        object-cover
      "
                />

                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="
        absolute
        top-2
        right-2
        bg-white
        rounded-full
        border
        p-1
      "
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        <button
          disabled={uploading}
          className="
            bg-[#1184CA]
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
            disabled:opacity-50
          "
        >
          {uploading ? "Menyimpan..." : "Simpan UMKM"}
        </button>
      </form>
    </div>
  );
}

function Input({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        rounded-xl
        border border-slate-200
        px-4 py-3
        text-sm
        outline-none
        focus:border-[#1184CA]
      "
    />
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2
        className="
        font-semibold
        text-slate-800
      "
      >
        {title}
      </h2>

      {children}
    </section>
  );
}
