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

export default async function UserUmkmPage() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;
  const role = cookieStore.get("role")?.value;

  if (!userId) {
    redirect("/");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/umkm`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok && res.status !== 404) {
    throw new Error("Gagal mengambil data UMKM");
  }

  const umkm = res.ok ? await res.json() : null;

  return (
    <main className="min-h-screen px-6 pb-6 bg-light dark:bg-dark">
      <div className="space-y-6">
        {!umkm ? (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-dark-card">
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
              text-black
              dark:text-white
              font-medium
              "
            >
              Tambah UMKM
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
            <div className="flex flex-col gap-5 md:flex-row flex items-center">
              <div className="h-40 w-full overflow-hidden rounded-xl md:w-56 flex items-center justify-center">
                {umkm.gambar?.[0] ? (
                  <img
                    src={umkm.gambar[0]}
                    alt={umkm.nama}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white dark:bg-dark-card">
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
                    text-sm text-black
                    dark:text-white
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
                    <div className="flex items-center gap-2 text-yellow-600 justify-start">
                      <Clock3 size={18} />
                      Menunggu persetujuan admin
                    </div>
                  )}

                  {umkm.approval_status === "approved" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={18} />
                      Update UMKM sudah disetujui
                    </div>
                  )}

                  {umkm.approval_status === "rejected" && (
                    <div className="flex items-center flex justify-start items-start gap-2 text-red-600 dark:text-red-400">
                      <XCircle size={18} />
                      <span className="font-medium">Update UMKM ditolak</span>

                      {umkm.rejected_reason && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-red-700 dark:text-red-300">
                            Alasan Penolakan
                          </p>

                          <p className="mt-1 whitespace-pre-wrap text-sm text-red-700 dark:text-red-300">
                            {umkm.rejected_reason}
                          </p>
                        </div>
                      )}
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
