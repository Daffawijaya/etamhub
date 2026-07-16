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
        className="
          absolute
          inset-0
          rounded-3xl
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
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
        className={`relative z-10 rounded-[23px] p-6 backdrop-blur-xl ${
          featured
            ? `
              bg-gradient-to-b
              from-[#844ec0]/20
              via-[#6f3fb1]/10
              to-[#ca3785]/10
              border
              border-[#844ec0]/30
            `
            : `
              bg-[#161616]
              border
              border-white/10
            `
        }`}
      >
        {featured && (
          <>
            <div
              className="
                absolute
                inset-0
                rounded-[23px]
                bg-gradient-to-br
                from-[#844ec0]/15
                via-transparent
                to-[#ca3785]/15
                pointer-events-none
              "
            />

            <span
              className="
                absolute
                top-4
                left-1/2
                -translate-x-1/2
                z-20
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                bg-gradient-to-r
                from-[#844ec0]
                to-[#ca3785]
                text-white
              "
            >
              Developer EtamHub
            </span>
          </>
        )}

        {/* Hover Glow Dalam */}
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

        <div className="relative z-10">
          <div className="relative h-65 flex items-end overflow-hidden">
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

          <h3
            className="
              pt-4
              text-xl
              font-bold
            "
            style={{
              background: featured
                ? "linear-gradient(180deg,#ffffff 0%,#d8c5ff 35%,#b88cff 70%,#844ec0 100%)"
                : "linear-gradient(180deg,#ffffff 0%,#e4e4e7 35%,#b4b4b8 75%,#71717a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {nama}
          </h3>

          <p
            className={`mt-2 transition-colors duration-300 ${
              featured
                ? "text-[#d7c2ff] group-hover:text-white"
                : "text-white/60 group-hover:text-white/80"
            }`}
          >
            {jabatan}
          </p>
        </div>
      </div>
    </div>
  );
}
