"use client";

import { useEffect, useState } from "react";
import BrandButton from "@/components/ui/BrandButton";

interface Props {
  onClose: () => void;
}

interface Kecamatan {
  id: string;
  nama: string;
}

export default function CreateAccountForm({ onClose }: Props) {
  const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);

  const [selectedKecamatan, setSelectedKecamatan] = useState<string[]>([]);
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/kecamatan")
      .then((res) => res.json())
      .then((data) => {
        setKecamatan(data);
      });
  }, []);

  function toggleKecamatan(id: string) {
    setSelectedKecamatan((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }
  async function handleSubmit() {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        username,
        password,
        role: "admin_kecamatan",
        kecamatanIds: selectedKecamatan,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Akun berhasil dibuat");

    onClose();

    window.location.reload();
  }
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-5
      "
    >
      <div
        className="
          w-full
          max-w-xl
          rounded-2xl
          bg-white
          p-6
          dark:bg-neutral-900
        "
      >
        <h2
          className="
            text-xl
            font-bold
          "
        >
          Tambah Akun
        </h2>

        <div className="mt-5 space-y-4">
          <input
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <div>
            <p className="font-semibold">Pilih Kecamatan</p>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-3
              "
            >
              {kecamatan.map((item) => (
                <label
                  key={item.id}
                  className="
                    flex
                    gap-2
                  "
                >
                  <input
                    type="checkbox"
                    checked={selectedKecamatan.includes(item.id)}
                    onChange={() => toggleKecamatan(item.id)}
                  />

                  {item.nama}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          <BrandButton variant="ghost" size="md" onClick={onClose}>
            Batal
          </BrandButton>

          <BrandButton variant="primary" size="md" onClick={handleSubmit}>
            Simpan
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
