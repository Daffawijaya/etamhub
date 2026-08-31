import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRound, Mail, CreditCard, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function UserProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/");
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select(
      `
      id,
      nik,
      email,
      umkm (
        pemilik,
        whatsapp
      )
    `,
    )
    .eq("id", userId)
    .single();

  if (error || !user) {
    redirect("/");
  }

  const umkm = Array.isArray(user.umkm) ? user.umkm[0] : user.umkm;
  const nama = umkm?.pemilik ?? "Nama Tidak Tersedia";
  const initials = nama
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Profile Hero + Info */}
        <div className="space-y-6 lg:col-span-8">
          {/* Gradient Hero Card */}
          <div
            className="
              relative overflow-hidden rounded-2xl p-5 text-white sm:p-8
              bg-gradient-to-br
              from-[#ff7a59]
              via-[#ff6b7d]
              to-[#ff4fa3]
              dark:from-[#1b1027]
              dark:via-[#21152f]
              dark:to-[#130f1d]
              transition-all duration-500
            "
          >
            {/* Decorative blurs */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#ff4fa3]/20" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-[#1184CA]/20" />

            <div className="relative">
              <Link
                href="/user"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Kembali
              </Link>

              <div className="flex items-center gap-4 sm:gap-5">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur-md sm:h-20 sm:w-20 sm:text-2xl dark:bg-white/10">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold sm:text-3xl">
                    {nama}
                  </h1>
                  <p className="mt-1 text-white/70">Pemilik UMKM</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm dark:bg-white/10">
                    <ShieldCheck size={14} />
                    Akun Terverifikasi
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* NIK */}
            <div className="rounded-2xl bg-white p-5 dark:bg-dark-card">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-violet-50 p-2 dark:bg-violet-500/10">
                  <CreditCard size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  NIK
                </span>
              </div>
              <p className="font-mono text-base font-semibold tracking-wider text-slate-900 sm:text-lg dark:text-white">
                {user.nik ?? "-"}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl bg-white p-5 dark:bg-dark-card">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-500/10">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Email
                </span>
              </div>
              <p className="truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                {user.email ?? "-"}
              </p>
            </div>

            {/* WhatsApp - full width */}
            <div className="rounded-2xl bg-white p-5 sm:col-span-2 dark:bg-dark-card">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-500/10">
                  <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  WhatsApp UMKM
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {umkm?.whatsapp ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Info */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status Card */}
          <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Status Akun
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Verifikasi</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <ShieldCheck size={12} />
                  Terverifikasi
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Pemilik UMKM</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              💡 Tips
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Pastikan data profil Anda lengkap dan akurat untuk memudahkan proses verifikasi oleh admin kecamatan.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
