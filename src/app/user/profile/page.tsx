import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRound, Mail, CreditCard, Phone, ShieldCheck } from "lucide-react";

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

  return (
    <main className="min-h-screen px-6 pb-6">
      <div className="">
        {/* Single Main Card (Semua konten di dalam sini) */}
        <div className="rounded-xl bg-white p-6 dark:bg-dark-card">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Profil Pengguna
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Kelola informasi identitas dan detail kontak UMKM Anda.
            </p>
          </div>

          {/* User Profile Summary */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <UserRound size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                  {umkm?.pemilik ?? "Nama Tidak Tersedia"}
                </h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Pemilik UMKM
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <ShieldCheck size={14} />
              Terverifikasi
            </div>
          </div>

          <hr className="my-8 border-zinc-100 dark:border-zinc-800/60" />

          {/* Details Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* NIK Item */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <CreditCard size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Nomor Induk Kependudukan
                </p>
                <p className="mt-1 font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
                  {user.nik ?? "-"}
                </p>
              </div>
            </div>

            {/* Email Item */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Mail size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Alamat Email
                </p>
                <p className="mt-1 truncate font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.email ?? "-"}
                </p>
              </div>
            </div>

            {/* WhatsApp Item */}
            <div className="flex items-start gap-3.5 sm:col-span-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Phone size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  WhatsApp UMKM
                </p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  {umkm?.whatsapp ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
