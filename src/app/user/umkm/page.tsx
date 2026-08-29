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
  Award,
} from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import UserProducts from "@/components/products/UserProducts";
import type { ReactNode } from "react";

const BADGE_SVG: Record<string, ReactNode> = {
  bronze: <SeedlingIcon className="h-3.5 w-3.5" />,
  silver: <SilverMedalIcon className="h-3.5 w-3.5" />,
  gold: <GoldMedalIcon className="h-3.5 w-3.5" />,
  platinum: <DiamondIcon className="h-3.5 w-3.5" />,
};

const BADGE_STYLE: Record<string, string> = {
  bronze: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
  silver: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
  gold: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/40",
  platinum: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/40",
};

export default async function UserUmkmPage() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;

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

  const isPending = umkm?.approval_status === "pending";
  const isPendingRequest = umkm?.isPendingRequest === true;

  return (
    <main>
      <div className="space-y-6 px-6 pb-6">
        {!umkm ? (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-dark-card">
            <h2 className="mt-4 text-lg font-semibold text-dark dark:text-light">
              Belum memiliki UMKM
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Satu akun hanya dapat mendaftarkan satu UMKM.
            </p>

            <Link
              href="/user/tambah"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-black dark:text-white"
            >
              Tambah UMKM
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card">
              <div className="flex flex-col gap-6 p-6 md:flex-row">
                <div className="h-44 w-full overflow-hidden rounded-xl bg-gray-100 md:h-40 md:w-52 dark:bg-gray-800">
                  {umkm.gambar?.[0] ? (
                    <img
                      src={umkm.gambar[0]}
                      alt={umkm.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Building2 size={36} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-dark dark:text-light">
                        {umkm.nama}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {umkm.kategori}
                      </p>
                    </div>

                    {isPending ? (
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock3 size={14} />
                        {isPendingRequest
                          ? "Menunggu Verifikasi Admin Kecamatan"
                          : "Menunggu Persetujuan"}
                      </span>
                    ) : umkm.hasPendingEdit ? (
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Clock3 size={14} />
                        Edit Menunggu Verifikasi
                      </span>
                    ) : (
                      <Link
                        href={`/user/umkm/${umkm.id}/edit`}
                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-black dark:text-white"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>
                    )}
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {umkm.kecamatan}
                    </p>

                    <p>{umkm.alamat}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {/* Badge */}
                    {umkm.badge && umkm.badge.level !== "none" ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${BADGE_STYLE[umkm.badge.level] ?? ""}`}>
                        {BADGE_SVG[umkm.badge.level]}
                        {umkm.badge.label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                        <Award size={14} />
                        Belum ada badge
                      </span>
                    )}

                    {umkm.published ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={14} />
                        Publik
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <Clock3 size={14} />
                        Belum Dipublikasikan
                      </span>
                    )}

                    {umkm.approval_status === "approved" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={14} />
                        Terverifikasi
                      </span>
                    )}

                    {umkm.approval_status === "pending" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock3 size={14} />
                        Pending
                      </span>
                    )}

                    {umkm.approval_status === "rejected" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <XCircle size={14} />
                        Ditolak
                      </span>
                    )}
                  </div>

                  {umkm.approval_status === "rejected" &&
                    umkm.rejected_reason && (
                      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                        <p className="font-medium">Alasan Penolakan</p>

                        <p className="mt-1 whitespace-pre-wrap">
                          {umkm.rejected_reason}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {umkm.approval_status === "approved" && (
              <UserProducts
                umkmId={umkm.id}
                legalitas={{
                  halal: umkm.halal,
                  pirt: umkm.pirt,
                  haki: umkm.haki,
                  kbli: umkm.kbli,
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
