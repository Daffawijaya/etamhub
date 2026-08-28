"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (data.role === "super_admin" || data.role === "admin_kecamatan" || data.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (data.role === "user_umkm") {
      window.location.href = "/user";
      return;
    }

    window.location.href = "/";
  };

  const handleGoogleLogin = async () => {
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
            Sign in
          </h1>

          <p className="mt-2 text-sm text-[#6B7280] dark:text-neutral-400">
            Selamat Datang! Masukkan Detail Anda.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Email atau NIK
            </label>

            <input
              type="text"
              value={login}
              placeholder="Masukkan email atau NIK"
              onChange={(e) => setLogin(e.target.value)}
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
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#374151] dark:text-neutral-300">
                Password
              </label>

              <button
                type="button"
                className="
                  text-xs text-[#6B7280]
                  transition
                  hover:text-black
                  dark:text-neutral-400
                  dark:hover:text-white
                "
              >
                Lupa Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Masukkan password"
                onChange={(e) => setPassword(e.target.value)}
                className="
                  h-11 w-full rounded-md
                  border border-[#D1D5DB]
                  bg-white
                  px-4 pr-11
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

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-[#6B7280]
                  transition
                  hover:text-black
                  dark:text-neutral-400
                  dark:hover:text-white
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="
                h-4 w-4 rounded
                border-gray-300
                accent-[#111827]
                dark:border-neutral-600
                dark:accent-white
              "
            />

            <span className="text-sm text-[#6B7280] dark:text-neutral-400">
              Ingat Saya
            </span>
          </label>

          <button
            onClick={handleLogin}
            className="
              h-11 w-full rounded-md
              bg-[#111827]
              text-sm font-medium
              text-white
              transition
              hover:opacity-90
              dark:bg-white
              dark:text-black
            "
          >
            Sign in
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
            onClick={handleGoogleLogin}
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
            Masuk dengan Google
          </button>

          <p className="pt-2 text-center text-sm text-[#6B7280] dark:text-neutral-400">
            Belum Punya Akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="
                font-medium
                text-[#111827]
                transition
                hover:underline
                dark:text-white
              "
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
