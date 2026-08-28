"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useModal } from "@/components/ui/modal";
import { initialForm } from "./constants";
import { UmkmFormData, ImageItem } from "./types";

import BasicSection from "./sections/BasicSection";
import OwnerSection from "./sections/OwnerSection";
import BusinessSection from "./sections/BusinessSection";
import LocationSection from "./sections/LocationSection";
import SocialSection from "./sections/SocialSection";
import ImageSection from "./sections/ImageSection";
import PublishSection from "./sections/PublishSection";
import BusinessInfoSection from "./sections/BusinessInfoSection";

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
  role?: "admin" | "user";
}

export default function UmkmForm({ mode, data, role = "admin" }: Props) {
  const router = useRouter();
  const modal = useModal();
  const [kecamatanOptions, setKecamatanOptions] = useState<string[]>([]);

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
          tahun_mulai_usaha: data.tahun_mulai_usaha ? String(data.tahun_mulai_usaha) : "",
          jumlah_tenaga_kerja: data.jumlah_tenaga_kerja ? String(data.jumlah_tenaga_kerja) : "",
          omzet: data.omzet ? String(data.omzet) : "",
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
  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        form,
        subkategoriLainnya,
        images: images.map((image) =>
          image.type === "old"
            ? {
                type: image.type,
                url: image.url,
              }
            : {
                type: image.type,
                name: image.file?.name,
                size: image.file?.size,
                lastModified: image.file?.lastModified,
              },
        ),
      }),
    [],
  );

  const currentSnapshot = JSON.stringify({
    form,
    subkategoriLainnya,
    images: images.map((image) =>
      image.type === "old"
        ? {
            type: image.type,
            url: image.url,
          }
        : {
            type: image.type,
            name: image.file?.name,
            size: image.file?.size,
            lastModified: image.file?.lastModified,
          },
    ),
  });

  const hasChanges = mode === "create" || currentSnapshot !== initialSnapshot;
  useEffect(() => {
    async function loadKecamatan() {
      const res = await fetch("/api/kecamatan");
      const data = await res.json();

      setKecamatanOptions(data.map((item: { nama: string }) => item.nama));
    }

    loadKecamatan();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (role !== "user" || mode !== "create") {
        return;
      }

      try {
        const res = await fetch("/api/user/profile");

        if (!res.ok) {
          return;
        }

        const user = await res.json();

        setForm((prev) => ({
          ...prev,
          nik: user.nik ?? "",
          email: user.email ?? "",
        }));
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, [role, mode]);

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
      modal.error({
        title: "Validasi Gagal",
        description: "NIK harus berupa 16 angka.",
      });
      return;
    }

    if (!isValidNib(form.nib)) {
      modal.error({
        title: "Validasi Gagal",
        description: "NIB harus berupa 13 angka.",
      });
      return;
    }

    if (!isValidFacebookUrl(form.facebook)) {
      modal.error({
        title: "Validasi Gagal",
        description: "URL Facebook tidak valid.",
      });
      return;
    }
    if (!isValidWhatsapp(form.whatsapp)) {
      modal.error({
        title: "Validasi Gagal",
        description: "Nomor WhatsApp tidak valid.",
      });

      return;
    }

    if (!isValidInstagramUsername(form.instagram)) {
      modal.error({
        title: "Validasi Gagal",
        description: "Username Instagram tidak valid.",
      });

      return;
    }

    if (!isValidTiktokUsername(form.tiktok)) {
      modal.error({
        title: "Validasi Gagal",
        description: "Username TikTok tidak valid.",
      });

      return;
    }

    if (!isValidEmail(form.email)) {
      modal.error({
        title: "Validasi Gagal",
        description: "Email tidak valid.",
      });

      return;
    }

    if (images.length === 0) {
      modal.error({
        title: "Validasi Gagal",
        description: "Gambar UMKM wajib diupload.",
      });

      return;
    }

    const confirmed = await modal.confirm({
      title: mode === "create" ? "Simpan UMKM?" : "Update UMKM?",
      description:
        mode === "create"
          ? "Data UMKM akan disimpan."
          : "Perubahan data UMKM akan diperbarui.",
      confirmText: mode === "create" ? "Simpan" : "Update",
      cancelText: "Batal",
    });

    if (!confirmed) {
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
          uploadedImages.push(await uploadFile(image.file));
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
        tahun_mulai_usaha: form.tahun_mulai_usaha ? Number(form.tahun_mulai_usaha) : null,
        jumlah_tenaga_kerja: form.jumlah_tenaga_kerja ? Number(form.jumlah_tenaga_kerja) : null,
        omzet: form.omzet ? Number(form.omzet) : null,

        // user create: always pending; user edit: direct update (no request)
        ...(role === "user" && mode === "create" && {
          published: false,
          approval_status: "pending",
        }),
      };

      const baseUrl = role === "admin" ? "/api/admin/umkm" : "/api/umkm";

      const url = mode === "create" ? baseUrl : `${baseUrl}/${data.id}`;

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

      if (role === "user") {
        router.push("/user/umkm");
      } else {
        router.push("/admin/umkm");
      }

      router.refresh();
    } catch (error: any) {
      modal.error({
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl px-6 py-5">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {mode === "create" ? "Tambah UMKM" : "Edit UMKM"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {mode === "create" && role === "user"
            ? "Data akan dikirim untuk proses persetujuan admin."
            : mode === "edit" && role === "user"
              ? "Perubahan akan langsung diperbarui."
              : "Kelola data UMKM."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicSection
          form={form}
          setForm={setForm}
          subkategoriLainnya={subkategoriLainnya}
          setSubkategoriLainnya={setSubkategoriLainnya}
        />

        <ImageSection images={images} required setImages={setImages} />

        <OwnerSection form={form} setForm={setForm} />

        <BusinessInfoSection form={form} setForm={setForm} />

        <BusinessSection form={form} setForm={setForm} />

        <LocationSection
          form={form}
          setForm={setForm}
          kecamatanOptions={kecamatanOptions}
        />

        <SocialSection form={form} setForm={setForm} />

        {role === "admin" && <PublishSection form={form} setForm={setForm} />}
        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
          <button
            type="submit"
            disabled={loading || !hasChanges}
            className="
    inline-flex
    items-center
    justify-center
    rounded-lg
    bg-emerald-600
    px-4
    py-2
    text-sm
    font-medium
    text-white
    transition-all
    duration-200
    hover:bg-emerald-700
    active:scale-[0.98]
    focus:outline-none
    focus:ring-2
    focus:ring-emerald-500
    focus:ring-offset-2
    focus:ring-offset-white
    dark:bg-emerald-500
    dark:hover:bg-emerald-400
    dark:focus:ring-emerald-400
    dark:focus:ring-offset-slate-900
    disabled:cursor-not-allowed
    disabled:bg-emerald-300
    dark:disabled:bg-emerald-900
    disabled:text-white/80
    dark:disabled:text-white/50
  "
          >
            {loading
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan UMKM"
                : "Update UMKM"}
          </button>
        </div>
      </form>
    </div>
  );
}
