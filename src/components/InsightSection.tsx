export default function InsightSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="">
        {/* FRAME */}
        <div className="relative overflow-hidden p-[14px]">
          {/* Gradient Frame */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  #7b8085 0%,
                  #6b7075 18%,
                  #777066 40%,
                  #68404a 60%,
                  #523760 78%,
                  #777c80 100%
                )
              `,
            }}
          />

          {/* PANEL */}
          <div className="relative h-[250px] overflow-hidden">
            {/* Base */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    90deg,
                    #676c71 0%,
                    #5e6368 24%,
                    #75695d 48%,
                    #603744 61%,
                    #4a315d 76%,
                    #676c71 100%
                  )
                `,
              }}
            />

            {/* Gold glow */}
            <div
              className="absolute -top-10 left-1/2 h-32 w-[700px] -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #b98d58, #a56c44, #6a3747, #56316d, transparent)",
                filter: "blur(55px)",
                opacity: 0.85,
              }}
            />

            {/* Purple glow */}
            <div
              className="absolute right-[18%] top-2 h-56 w-56 rounded-full"
              style={{
                background: "#59387a",
                filter: "blur(90px)",
                opacity: 0.4,
              }}
            />

            {/* Orange glow */}
            <div
              className="absolute left-[35%] top-4 h-56 w-56 rounded-full"
              style={{
                background: "#b5824c",
                filter: "blur(90px)",
                opacity: 0.35,
              }}
            />

            {/* Dark blur bottom */}
            <div
              className="absolute bottom-[-80px] left-1/2 h-40 w-[850px] -translate-x-1/2 rounded-full"
              style={{
                background: "#101012",
                filter: "blur(90px)",
                opacity: 0.96,
              }}
            />

            {/* Noise */}
            <div
              className="absolute inset-0 pointer-events-none opacity-18 mix-blend-overlay"
              style={{
                backgroundImage: "url('/grian.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "500px",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-6">
              <div className="max-w-3xl text-center">
                <h2 className="text-4xl leading-[1.3] text-white md:text-4xl">
                  Ribuan peluang usaha dimulai dari pelaku lokal yang terus
                  tumbuh dan berkembang
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
