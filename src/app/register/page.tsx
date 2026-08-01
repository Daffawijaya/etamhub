"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNikChange = (value: string) => {
    setNik(value.replace(/\D/g, "").slice(0, 16));
  };

  async function handleRegister() {
    if (nik.length !== 16) {
      alert("NIK harus terdiri dari 16 digit.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      alert("Email wajib diisi.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      alert("Email harus menggunakan akun @gmail.com.");
      return;
    }

    if (!password) {
      alert("Password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (!confirmPassword) {
      alert("Konfirmasi password wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik,
        email: normalizedEmail,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Akun berhasil dibuat.");

    router.replace("/login");
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="absolute left-8 top-5 text-3xl font-extrabold text-black dark:text-white"
      >
        etamhub.
      </Link>

      <div className="w-full max-w-md">
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Buat Akun
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Daftarkan akun untuk mengakses EtamHub.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              NIK
            </label>

            <input
              type="text"
              value={nik}
              onChange={(e) => handleNikChange(e.target.value)}
              placeholder="Masukkan NIK"
              inputMode="numeric"
              maxLength={16}
              pattern="[0-9]{16}"
              className="
                w-full rounded-xl border border-neutral-300
                bg-white px-4 py-3 text-black outline-none
                transition focus:border-primary
                dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              className="
                w-full rounded-xl border border-neutral-300
                bg-white px-4 py-3 text-black outline-none
                transition focus:border-primary
                dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className="
                  w-full rounded-xl border border-neutral-300
                  bg-white px-4 py-3 pr-12 text-black outline-none
                  transition focus:border-primary
                  dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi Password"
                className="
                  w-full rounded-xl border border-neutral-300
                  bg-white px-4 py-3 pr-12 text-black outline-none
                  transition focus:border-primary
                  dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="
              w-full rounded-full bg-violet-500 py-4
              font-semibold text-white transition
              hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {loading ? "Membuat akun..." : "Buat Akun"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
