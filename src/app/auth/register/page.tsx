"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
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

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik,
          email: normalizedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("REGISTER ERROR:", data);

        alert(
          typeof data?.message === "string"
            ? data.message
            : "Terjadi kesalahan.",
        );

        return;
      }

      sessionStorage.setItem("register_email", normalizedEmail);

      sessionStorage.setItem("register_nik", nik);

      router.push("/auth/register/verify-otp");
    } catch {
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleRegister = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-8 dark:bg-dark">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-[30px] font-semibold tracking-tight text-[#111827] dark:text-white">
            Sign up
          </h1>

          <p className="mt-2 text-sm text-[#6B7280] dark:text-neutral-400">
            Buat akun baru untuk mengakses etamhub.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              NIK
            </label>

            <input
              type="text"
              value={nik}
              onChange={(e) => handleNikChange(e.target.value)}
              placeholder="Masukkan NIK"
              inputMode="numeric"
              maxLength={16}
              className="
                h-11 w-full rounded-md
                border border-[#D1D5DB]
                bg-white
                px-4
                text-sm text-[#111827]
                outline-none
                transition
                placeholder:text-[#9CA3AF]
                focus:border-[#111827]
                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-white
                dark:placeholder:text-neutral-500
                dark:focus:border-white
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              className="
                h-11 w-full rounded-md
                border border-[#D1D5DB]
                bg-white
                px-4
                text-sm text-[#111827]
                outline-none
                transition
                placeholder:text-[#9CA3AF]
                focus:border-[#111827]
                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-white
                dark:placeholder:text-neutral-500
                dark:focus:border-white
              "
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="
              h-11 w-full rounded-md
              bg-[#111827]
              text-sm font-medium
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-70
              dark:bg-white
              dark:text-black
            "
          >
            {loading ? "Mengirim OTP..." : "Kirim OTP"}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB] dark:border-neutral-700" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#9CA3AF] dark:bg-dark dark:text-neutral-500">
                atau
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="
              flex h-11 w-full
              items-center justify-center gap-3
              rounded-md
              border border-[#D1D5DB]
              bg-white
              text-sm font-medium
              text-[#111827]
              transition
              hover:bg-[#F9FAFB]
              dark:border-neutral-700
              dark:bg-neutral-900
              dark:text-white
              dark:hover:bg-neutral-800
            "
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.278 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.278 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.176 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.145 35.091 26.671 36 24 36c-5.173 0-9.625-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.57l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Daftar dengan Google
          </button>

          <p className="pt-2 text-center text-sm text-[#6B7280] dark:text-neutral-400">
            Sudah Punya Akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="
                font-medium
                text-[#111827]
                transition
                hover:underline
                dark:text-white
              "
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
