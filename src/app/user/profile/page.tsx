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
    <main className="min-h-screen px-6 pb-6 bg-light dark:bg-dark">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-light">
            Profil Saya
          </h1>

          <p className="text-sm text-gray-500">
            Informasi akun pengguna dan data identitas.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <UserRound className="text-primary" size={32} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-dark dark:text-light">
                {user.umkm?.[0]?.pemilik ?? "-"}
              </h2>

              <p className="text-sm text-gray-500">Pemilik UMKM</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-light-bg p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard size={16} />
                NIK
              </div>

              <p className="mt-2 font-medium text-dark dark:text-light">
                {user.nik}
              </p>
            </div>

            <div className="rounded-xl bg-light-bg p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={16} />
                Email
              </div>

              <p className="mt-2 font-medium text-dark dark:text-light">
                {user.email ?? "-"}
              </p>
            </div>

            <div className="rounded-xl bg-light-bg p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={16} />
                WhatsApp
              </div>

              <p className="mt-2 font-medium text-dark dark:text-light">
                {user.umkm?.[0]?.whatsapp ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
