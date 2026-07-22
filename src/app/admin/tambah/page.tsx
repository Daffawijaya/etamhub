"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TambahUmkmPage() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
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
  const [form, setForm] = useState({
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
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/umkm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        gambar: images,
        lat: Number(form.lat),
        lng: Number(form.lng),
      }),
    });

    router.push("/admin/umkm");
    router.refresh();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Tambah UMKM</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nama UMKM"
          className="w-full border p-3 rounded"
          value={form.nama}
          onChange={(e) =>
            setForm({
              ...form,
              nama: e.target.value,
            })
          }
        />

        <input
          placeholder="Pemilik"
          className="w-full border p-3 rounded"
          value={form.pemilik}
          onChange={(e) =>
            setForm({
              ...form,
              pemilik: e.target.value,
            })
          }
        />

        <input
          placeholder="Kategori"
          className="w-full border p-3 rounded"
          value={form.kategori}
          onChange={(e) =>
            setForm({
              ...form,
              kategori: e.target.value,
            })
          }
        />

        <input
          placeholder="Subkategori"
          className="w-full border p-3 rounded"
          value={form.subkategori}
          onChange={(e) =>
            setForm({
              ...form,
              subkategori: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Deskripsi"
          className="w-full border p-3 rounded h-40"
          value={form.deskripsi}
          onChange={(e) =>
            setForm({
              ...form,
              deskripsi: e.target.value,
            })
          }
        />

        <input
          placeholder="Kecamatan"
          className="w-full border p-3 rounded"
          value={form.kecamatan}
          onChange={(e) =>
            setForm({
              ...form,
              kecamatan: e.target.value,
            })
          }
        />

        <input
          placeholder="Alamat"
          className="w-full border p-3 rounded"
          value={form.alamat}
          onChange={(e) =>
            setForm({
              ...form,
              alamat: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Latitude"
            className="border p-3 rounded"
            value={form.lat}
            onChange={(e) =>
              setForm({
                ...form,
                lat: e.target.value,
              })
            }
          />

          <input
            placeholder="Longitude"
            className="border p-3 rounded"
            value={form.lng}
            onChange={(e) =>
              setForm({
                ...form,
                lng: e.target.value,
              })
            }
          />
        </div>

        <input
          placeholder="WhatsApp"
          className="w-full border p-3 rounded"
          value={form.whatsapp}
          onChange={(e) =>
            setForm({
              ...form,
              whatsapp: e.target.value,
            })
          }
        />

        <input
          placeholder="Instagram"
          className="w-full border p-3 rounded"
          value={form.instagram}
          onChange={(e) =>
            setForm({
              ...form,
              instagram: e.target.value,
            })
          }
        />
        <div className="space-y-3">
          <label className="block font-medium">Gambar UMKM</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = e.target.files;

              if (!files?.length) return;

              setUploading(true);

              const uploaded: string[] = [];

              for (const file of Array.from(files)) {
                const url = await uploadFile(file);
                uploaded.push(url);
              }

              setImages((prev) => [...prev, ...uploaded]);

              setUploading(false);
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                alt=""
                className="w-full h-24 object-cover rounded border"
              />

              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full"
                onClick={() => setImages(images.filter((i) => i !== img))}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-5 py-3 rounded disabled:opacity-50"
        >
          {uploading ? "Mengupload..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
