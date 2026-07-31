import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  MapPin,
  Pencil,
} from "lucide-react";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function UserUmkmPage() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;
  const role = cookieStore.get("role")?.value;

  if (!userId) {
    redirect("/");
  }

  const { data: umkm, error } = await supabaseAdmin
    .from("umkm")
    .select(
      `
    id,
    nama,
    kategori,
    kecamatan,
    alamat,
    gambar,
    approval_status,
    published,
    created_at
    `,
    )
    .eq("owner_id", userId)
    .maybeSingle();

  console.log("USER ID COOKIE:", userId);
  console.log("ROLE COOKIE:", role);
  console.log("UMKM DATA:", umkm);
  console.log("UMKM ERROR:", error);

  return (
    <main className="min-h-screen px-6 pb-6 bg-light dark:bg-dark">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-light">
            UMKM Saya
          </h1>

          <p className="text-sm text-gray-500">
            Kelola satu data UMKM yang terhubung dengan akun Anda.
          </p>
        </div>

        {!umkm ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
            <Building2 size={48} className="mx-auto text-primary" />

            <h2 className="mt-4 text-xl font-semibold text-dark dark:text-light">
              Belum memiliki UMKM
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Satu akun hanya dapat mendaftarkan satu UMKM.
            </p>

            <Link
              href="/user/tambah"
              className="
              mt-6
              inline-flex
              rounded-xl
              bg-primary
              px-5
              py-3
              text-white
              font-medium
              "
            >
              Tambah UMKM
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="h-40 w-full overflow-hidden rounded-xl md:w-56">
                {umkm.gambar?.[0] ? (
                  <img
                    src={umkm.gambar[0]}
                    alt={umkm.nama}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <Building2 />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-dark dark:text-light">
                      {umkm.nama}
                    </h2>

                    <p className="text-sm text-gray-500">{umkm.kategori}</p>
                  </div>

                  <Link
                    href={`/user/umkm/${umkm.id}/edit`}
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-4
                    py-2
                    text-sm
                    text-white
                    "
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {umkm.kecamatan}
                  </p>

                  <p>{umkm.alamat}</p>
                </div>

                <div className="mt-6">
                  {umkm.approval_status === "pending" && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Clock3 size={18} />
                      Menunggu persetujuan admin
                    </div>
                  )}

                  {umkm.approval_status === "approved" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={18} />
                      UMKM sudah disetujui
                    </div>
                  )}

                  {umkm.approval_status === "rejected" && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle size={18} />
                      UMKM ditolak
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
