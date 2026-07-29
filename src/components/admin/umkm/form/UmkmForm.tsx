"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { initialForm } from "./constants";
import { UmkmFormData, ImageItem } from "./types";

import BasicSection from "./sections/BasicSection";
import OwnerSection from "./sections/OwnerSection";
import BusinessSection from "./sections/BusinessSection";
import LocationSection from "./sections/LocationSection";
import SocialSection from "./sections/SocialSection";
import ImageSection from "./sections/ImageSection";
import PublishSection from "./sections/PublishSection";

import {
  isValidFacebookUrl,
  isValidInstagramUsername,
  isValidTiktokUsername,
  normalizeWhatsapp,
  normalizeInstagramUsername,
  normalizeTiktokUsername,
  isValidWhatsapp,
  isValidEmail,
  isValidNib,
} from "@/lib/validation";

interface Props {
  mode: "create" | "edit";

  data?: any;
}

export default function UmkmForm({ mode, data }: Props) {
  console.log("UMKM FORM RENDER");
  const router = useRouter();
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);

  useEffect(() => {
    async function loadKecamatan() {
      try {
        const res = await fetch("/api/auth/me");

        const user = await res.json();

        console.log("USER LOGIN:", user);

        // admin kecamatan hanya lihat kecamatan miliknya
        if (user.role === "admin_kecamatan") {
          setKecamatanOptions(
            user.kecamatan?.map((item: { nama: string }) => item.nama) ?? [],
          );
        }

        // super admin lihat semua kecamatan
        if (user.role === "super_admin") {
          const resKecamatan = await fetch("/api/kecamatan");

          const data = await resKecamatan.json();

          setKecamatanOptions(data.map((item: { nama: string }) => item.nama));
        }
      } catch (error) {
        console.error("LOAD KECAMATAN ERROR:", error);
      }
    }

    loadKecamatan();
  }, []);

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
          kbli: Array.isArray(data.kbli)
            ? data.kbli
            : data.kbli
              ? [data.kbli]
              : [],

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

    if (!/^\d{16}$/.test(form.nik)) {
      alert("NIK harus berupa 16 angka");
      return;
    }
    if (!isValidNib(form.nib)) {
      alert("NIB harus berupa 13 angka");
      return;
    }
    if (!isValidFacebookUrl(form.facebook)) {
      alert("URL Facebook tidak valid");
      return;
    }

    if (!isValidWhatsapp(form.whatsapp)) {
      alert("Nomor WhatsApp tidak valid");
      return;
    }

    if (!isValidInstagramUsername(form.instagram)) {
      alert("Username Instagram tidak valid");
      return;
    }

    if (!isValidTiktokUsername(form.tiktok)) {
      alert("Username TikTok tidak valid");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Email tidak valid");
      return;
    }
    if (images.length === 0) {
      alert("Gambar UMKM wajib diupload");
      return;
    }

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
        instagram: normalizeInstagramUsername(form.instagram),
        whatsapp: normalizeWhatsapp(form.whatsapp),
        tiktok: normalizeTiktokUsername(form.tiktok),
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
        <ImageSection images={images} required setImages={setImages} />
        <OwnerSection form={form} setForm={setForm} />

        <BusinessSection form={form} setForm={setForm} />

        <LocationSection
          form={form}
          setForm={setForm}
          kecamatanOptions={kecamatanOptions}
        />

        <SocialSection form={form} setForm={setForm} />

        <PublishSection form={form} setForm={setForm} />

        <button
          disabled={loading}
          className="
dark:bg-success
bg-gre
transition
duration-300
text-white
px-4
py-2
rounded-lg
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
