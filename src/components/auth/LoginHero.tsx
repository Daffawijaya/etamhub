import Image from "next/image";
import Link from "next/link";

export default function LoginHero() {
  return (
    <section className="hidden h-screen p-4 lg:block">
      <div className="relative h-full overflow-hidden rounded-[18px]">
        <Image
          src="/bgrr.png"
          alt="EtamHub Login"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

        {/* Logo */}
        <div className="absolute left-7 top-7 z-10">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-white"
          >
            etamhub.
          </Link>
        </div>

        {/* Bottom Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-8">
          <div className="max-w-xs">
            <h2 className="text-[34px] font-semibold leading-[1.3] tracking-tight text-white">
              Jelajahi UMKM
              <br />
              di Kukar.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Temukan produk lokal dan dukung UMKM Kabupaten Kutai Kartanegara.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
