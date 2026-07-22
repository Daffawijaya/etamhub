import Image from "next/image";

export default function LoginHero() {
  return (
    <section className="hidden p-4 lg:block">
      <div className="relative h-full overflow-hidden rounded-3xl">
        <Image
          src="/bglogin.jpg"
          alt="EtamHub Login"
          fill
          priority
          className="object-cover"
        />

        {/* overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
      linear-gradient(
        to bottom,
        rgba(18,19,19,1) 0%,
        rgba(18,19,19,0.80) 15%,
        rgba(18,19,19,0.40) 35%,
        rgba(18,19,19,0.0) 55%,
        rgba(18,19,19,0.0) 75%,
        rgba(18,19,19,0.00) 100%
      )
    `,
          }}
        />

        {/* text */}
        <div className="absolute inset-0 flex items-start justify-center pt-24">
          <div className="max-w-lg px-6 text-center">
            <h2 className="text-4xl font-bold text-white">
              Jelajahi Seluruh UMKM
              <br />
              Kutai Kartanegara
            </h2>

            <p className="mt-4 text-white/80">
              Platform digital UMKM Kabupaten Kutai Kartanegara.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
