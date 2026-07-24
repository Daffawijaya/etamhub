"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { getUmkmImage } from "@/lib/getUmkmImage";
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

interface Props {
  mode: "create" | "edit";
  data?: any;
}

type ImageItem = {
  type: "old" | "new";
  url: string;
  file?: File;
};

export default function UmkmForm({ mode, data }: Props) {
  const router = useRouter();

  const [subkategoriLainnya, setSubkategoriLainnya] = useState(
    data?.subkategori || "",
  );

  const [form, setForm] = useState(
    data
      ? {
          nama: data.nama ?? "",
          pemilik: data.pemilik ?? "",
          kategori: data.kategori ?? "",
          subkategori: data.subkategori ?? "",
          deskripsi: data.deskripsi ?? "",
          kecamatan: data.kecamatan ?? "",
          alamat: data.alamat ?? "",
          lat: String(data.lat ?? ""),
          lng: String(data.lng ?? ""),
          whatsapp: data.whatsapp ?? "",
          instagram: data.instagram ?? "",
          facebook: data.facebook ?? "",
          tiktok: data.tiktok ?? "",
        }
      : {
          ...initialForm,
        },
  );

  const [images, setImages] = useState<ImageItem[]>(
    data?.gambar?.map((img: string) => ({
      type: "old",
      url: img,
    })) ?? [],
  );

  const [uploading, setUploading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function uploadFile(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload gambar gagal");
    }

    const result = await res.json();

    return result.url;
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const newImages = files.map((file) => ({
      type: "new" as const,
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setUploading(true);

    try {
      const uploadedImages: string[] = [];

      for (const image of images) {
        if (image.type === "old") {
          uploadedImages.push(image.url);
        }

        if (image.type === "new" && image.file) {
          const url = await uploadFile(image.file);

          uploadedImages.push(url);
        }
      }

      const url = mode === "create" ? "/api/umkm" : `/api/umkm/${data.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
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
          lat: form.lat ? Number(form.lat) : null,
          lng: form.lng ? Number(form.lng) : null,
        }),
      });

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan UMKM");
      }

      router.push("/admin/umkm");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="
        bg-white
        dark:bg-dark-card
        rounded-2xl
        px-6 py-5
        transition-colors duration-300
      "
    >
      <div className="mb-8">
        <h1
          className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white
            transition-colors duration-300
          "
        >
          {mode === "create" ? "Tambah UMKM" : "Edit UMKM"}
        </h1>

        <p
          className="
          text-sm
          text-slate-500
          dark:text-slate-400
          mt-1
        "
        >
          {mode === "create"
            ? "Tambahkan data UMKM baru ke katalog."
            : "Perbarui data UMKM yang sudah ada."}
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

              <div className="space-y-2">
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
              placeholder:text-slate-400
dark:placeholder:text-slate-500
              rounded-xl
              border border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-dark
              text-slate-900
              dark:text-white
              px-4 py-3
              text-sm
              outline-none
              transition-colors duration-300
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
              ["facebook", "Facebook URL"],
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
              dark:border-slate-700
              rounded-xl
              p-6
              cursor-pointer
              hover:bg-slate-50
              dark:hover:bg-slate-900
              transition-colors duration-300
            "
          >
            <Upload size={18} />

            <span
              className="
              text-sm
              text-slate-700
              dark:text-slate-300
            "
            >
              Upload gambar
            </span>

            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
            />
          </label>

          {images.length > 0 && (
            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mt-4
            "
            >
              {images.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="
                  relative
                  border
                  border-slate-200
                  dark:border-slate-800
                  rounded-xl
                  overflow-hidden
                "
                >
                  <img
                    src={
                      image.type === "old" ? getUmkmImage(image.url) : image.url
                    }
                    alt="gambar UMKM"
                    referrerPolicy="no-referrer"
                    className="
                    h-28
                    w-full
                    object-cover
                  "
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImages((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="
                    absolute
                    top-2
                    right-2
                    bg-white
                    dark:bg-dark
                    rounded-full
                    border
                    border-slate-200
                    dark:border-slate-700
                    p-1
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                    transition-colors
                  "
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            transition-all duration-300
            hover:opacity-90
            disabled:opacity-50
          "
        >
          {uploading
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan UMKM"
              : "Update UMKM"}
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
dark:border-slate-800
bg-white
dark:bg-dark
text-slate-900
dark:text-white
placeholder:text-slate-400
dark:placeholder:text-slate-500
px-4 py-3
text-sm
outline-none
transition-colors duration-300
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
dark:text-white
transition-colors duration-300
"
      >
        {title}
      </h2>

      {children}
    </section>
  );
}
