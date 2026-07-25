"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { initialForm } from "./constants";
import { UmkmFormData, ImageItem } from "./types";

import BasicSection from "./sections/BasicSection";
import OwnerSection from "./sections/OwnerSection";
import BusinessSection from "./sections/BusinessSection";
import LocationSection from "./sections/LocationSection";
import SocialSection from "./sections/SocialSection";
import ImageSection from "./sections/ImageSection";
import PublishSection from "./sections/PublishSection";

interface Props {
  mode: "create" | "edit";

  data?: any;
}

export default function UmkmForm({ mode, data }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<UmkmFormData>(
    data
      ? {
          ...initialForm,

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

          nik: data.nik ?? "",

          jenis_kelamin: data.jenis_kelamin ?? "",

          email: data.email ?? "",

          nib: data.nib ?? "",
          kbli: data.kbli ?? "",

          npwp: data.npwp ?? "",

          halal: data.halal ?? "",

          pirt: data.pirt ?? "",

          haki: data.haki ?? "",

          published: data.published ?? false,
        }
      : initialForm,
  );

  const [subkategoriLainnya, setSubkategoriLainnya] = useState(
    data?.subkategori ?? "",
  );

  const [images, setImages] = useState<ImageItem[]>(
    data?.gambar?.map((img: string) => ({
      type: "old",

      url: img,
    })) ?? [],
  );

  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

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

      const payload = {
        ...form,

        subkategori:
          form.subkategori === "Lainnya"
            ? subkategoriLainnya
            : form.subkategori,

        gambar: uploadedImages,

        lat: form.lat ? Number(form.lat) : null,

        lng: form.lng ? Number(form.lng) : null,
      };

      const url = mode === "create" ? "/api/umkm" : `/api/umkm/${data.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan UMKM");
      }

      router.push("/admin/umkm");

      router.refresh();
    } catch (error: any) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
bg-white
dark:bg-dark-card
rounded-2xl
px-6
py-5
"
    >
      <div className="mb-8">
        <h1
          className="
text-2xl
font-bold
text-slate-900
dark:text-white
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

      <form
        onSubmit={handleSubmit}
        className="
space-y-8
"
      >
        <BasicSection
          form={form}
          setForm={setForm}
          subkategoriLainnya={subkategoriLainnya}
          setSubkategoriLainnya={setSubkategoriLainnya}
        />

        <OwnerSection form={form} setForm={setForm} />

        <BusinessSection form={form} setForm={setForm} />

        <LocationSection form={form} setForm={setForm} />

        <SocialSection form={form} setForm={setForm} />

        <ImageSection images={images} setImages={setImages} />

        <PublishSection form={form} setForm={setForm} />

        <button
          disabled={loading}
          className="
bg-[#1184CA]
text-white
px-6
py-3
rounded-xl
font-medium
hover:opacity-90
disabled:opacity-50
"
        >
          {loading
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan UMKM"
              : "Update UMKM"}
        </button>
      </form>
    </div>
  );
}
