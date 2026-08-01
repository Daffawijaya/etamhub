import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRound, Mail, CreditCard, Phone } from "lucide-react";

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
    avatar_url,
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

  return (
    <main className="min-h-screen bg-light px-6 pb-6 dark:bg-dark">
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-dark-card">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 transition-colors duration-300 dark:text-white">
              Profil Saya
            </h2>

            <p className="mt-1 text-sm text-slate-500 transition-colors duration-300 dark:text-slate-400">
              Informasi akun pengguna dan data identitas.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-5 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="text-primary" size={38} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-2xl font-semibold text-dark dark:text-light">
                {user.umkm?.[0]?.pemilik ?? "-"}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Pemilik UMKM
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-5 transition-colors dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CreditCard size={16} />
                <span>NIK</span>
              </div>

              <p className="mt-3 break-all text-base font-medium text-dark dark:text-light">
                {user.nik ?? "-"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5 transition-colors dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail size={16} />
                <span>Email</span>
              </div>

              <p className="mt-3 break-all text-base font-medium text-dark dark:text-light">
                {user.email ?? "-"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5 transition-colors dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Phone size={16} />
                <span>WhatsApp</span>
              </div>

              <p className="mt-3 text-base font-medium text-dark dark:text-light">
                {user.umkm?.[0]?.whatsapp ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
