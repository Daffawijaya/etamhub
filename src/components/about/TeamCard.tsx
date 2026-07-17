import Image from "next/image";

interface TeamCardProps {
  nama: string;
  jabatan: string;
  foto: string;
  featured?: boolean;
}

export default function TeamCard({
  nama,
  jabatan,
  foto,
  featured,
}: TeamCardProps) {
  return (
    <div
      className="
        group
        relative
        h-full
        w-full
        max-w-[260px]
        sm:max-w-none
        overflow-hidden
        rounded-3xl
        p-[1px]
        transition-all
        duration-500
        hover:-translate-y-2
      "
    >
      {/* Animated Border */}
      <div
        className={`
          absolute
          inset-0
          rounded-3xl
          transition-opacity
          duration-500
          ${featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[250%]
            w-[250%]
            -translate-x-1/2
            -translate-y-1/2
            animate-[spin_4s_linear_infinite]
            bg-[conic-gradient(from_0deg,#844ec0,#ca3785,#844ec0,#ca3785,#844ec0)]
          "
        />
      </div>

      {/* Card */}
      <div
        className={`
          relative
          z-10
          flex
          h-full
          flex-col
          rounded-[23px]
          backdrop-blur-xl
          transition-all
          duration-500

          ${
            featured
              ? "pt-12 px-3 pb-3 sm:pt-12 sm:px-4 md:p-6"
              : "p-3 sm:p-4 md:p-6"
          }

          ${
            featured
              ? `
                border border-[#844ec0]/30
                bg-light
                dark:bg-[#161616]
                group-hover:bg-gradient-to-b
                group-hover:from-[#844ec0]/20
                group-hover:via-[#6f3fb1]/10
                group-hover:to-[#ca3785]/10
              `
              : `
                border border-white
                dark:border-white/10
                bg-light
                dark:bg-[#161616]
              `
          }
        `}
      >
        {featured && (
          <>
            {/* Inner Glow */}
            <div
              className="
                absolute
                inset-0
                rounded-[23px]
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
                bg-gradient-to-br
                from-[#844ec0]/15
                via-transparent
                to-[#ca3785]/15
                pointer-events-none
              "
            />

            {/* Badge */}
            <span
              className="
                absolute
                top-3
                md:top-4
                left-1/2
                -translate-x-1/2
                z-20
                px-3
                py-1
                rounded-full
                text-[10px]
                sm:text-xs
                font-semibold
                whitespace-nowrap
                bg-gradient-to-r
                from-[#844ec0]
                to-[#ca3785]
                text-white
              "
            >
              Developer etamhub
            </span>
          </>
        )}

        {/* Hover Glow */}
        <div
          className="
            absolute
            inset-0
            rounded-[23px]
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
            bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_50%)]
          "
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* Foto */}
          <div
            className={`
              relative
              w-full
              flex-shrink-0
              overflow-hidden

              ${featured ? "h-40 sm:h-48 md:h-64" : "h-44 sm:h-52 md:h-64"}
            `}
          >
            <Image
              src={foto}
              alt={nama}
              fill
              className="
                object-contain
                object-bottom
                origin-bottom
                transition-transform
                duration-500
                group-hover:scale-105
                [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]
              "
            />
          </div>

          {/* Text */}
          <div
            className="
              mt-1
              h-16
              sm:h-18
              md:h-20
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <h3
              className="
    text-base
    sm:text-lg
    md:text-xl
    font-bold
    leading-tight
    text-zinc-900
    dark:text-white
  "
            >
              {nama}
            </h3>

            <p
              className={`
                mt-1
                text-xs
                sm:text-sm
                md:text-base
                leading-snug
                transition-colors
                duration-300

                ${
                  featured
                    ? "text-[#6d5a96] dark:text-[#d7c2ff] group-hover:text-black dark:group-hover:text-white"
                    : "text-zinc-600 dark:text-white/60 group-hover:text-black/80 dark:group-hover:text-white/80"
                }
              `}
            >
              {jabatan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
