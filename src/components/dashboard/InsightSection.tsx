export default function InsightSection() {
  return (
    <section className="relative overflow-hidden bg-[#e7e7f1] dark:bg-transparent transition-colors">
      <div>
        {/* FRAME */}
        <div className="relative overflow-hidden p-[5px] sm:p-[8px] md:p-[14px]">
          {/* Gradient Frame */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  #d9dbe2 0%,
                  #c7cad2 18%,
                  #d8cfc4 40%,
                  #d2aab5 60%,
                  #c4b0dc 78%,
                  #d9dbe2 100%
                )
              `,
            }}
          />

          <div
            className="absolute inset-0 hidden dark:block"
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
          <div className="relative min-h-[220px] sm:h-[250px] overflow-hidden">
            {/* Base Light */}
            <div
              className="absolute inset-0 dark:hidden"
              style={{
                background: `
                  linear-gradient(
                    90deg,
                    #f0f1f5 0%,
                    #e5e6ec 24%,
                    #ddd2c5 48%,
                    #e0c1c8 61%,
                    #d5c4e7 76%,
                    #f0f1f5 100%
                  )
                `,
              }}
            />

            {/* Base Dark */}
            <div
              className="absolute inset-0 hidden dark:block"
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
              className="
                absolute
                -top-10
                left-1/2
                h-24
                w-[300px]
                sm:h-32
                sm:w-[500px]
                md:w-[700px]
                -translate-x-1/2
              "
              style={{
                background:
                  "linear-gradient(90deg, transparent, #b98d58, #a56c44, #6a3747, #56316d, transparent)",
                filter: "blur(55px)",
                opacity: 0.85,
              }}
            />

            {/* Purple glow */}
            <div
              className="
                absolute
                right-[5%]
                sm:right-[18%]
                top-2
                h-40
                w-40
                sm:h-56
                sm:w-56
                rounded-full
              "
              style={{
                background: "#bda4d8",
                filter: "blur(90px)",
                opacity: 0.35,
              }}
            />

            <div
              className="
                absolute
                right-[5%]
                sm:right-[18%]
                top-2
                h-40
                w-40
                sm:h-56
                sm:w-56
                rounded-full
                hidden dark:block
              "
              style={{
                background: "#59387a",
                filter: "blur(90px)",
                opacity: 0.4,
              }}
            />

            {/* Orange glow */}
            <div
              className="
                absolute
                left-[15%]
                sm:left-[35%]
                top-4
                h-40
                w-40
                sm:h-56
                sm:w-56
                rounded-full
              "
              style={{
                background: "#d8b27b",
                filter: "blur(90px)",
                opacity: 0.35,
              }}
            />

            <div
              className="
                absolute
                left-[15%]
                sm:left-[35%]
                top-4
                h-40
                w-40
                sm:h-56
                sm:w-56
                rounded-full
                hidden dark:block
              "
              style={{
                background: "#b5824c",
                filter: "blur(90px)",
                opacity: 0.35,
              }}
            />

            {/* Dark blur bottom */}
            <div
              className="
                absolute
                bottom-[-60px]
                left-1/2
                h-32
                w-[400px]
                sm:h-40
                sm:w-[600px]
                md:w-[850px]
                -translate-x-1/2
                rounded-full
              "
              style={{
                background: "#cfd0d8",
                filter: "blur(90px)",
                opacity: 0.8,
              }}
            />

            <div
              className="
                absolute
                bottom-[-60px]
                left-1/2
                h-32
                w-[400px]
                sm:h-40
                sm:w-[600px]
                md:w-[850px]
                -translate-x-1/2
                rounded-full
                hidden dark:block
              "
              style={{
                background: "#101012",
                filter: "blur(90px)",
                opacity: 0.96,
              }}
            />

            {/* Noise */}
            <div
              className="
                absolute 
                inset-0 
                pointer-events-none 
                opacity-20 
                mix-blend-overlay
              "
              style={{
                backgroundImage: "url('/grian.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "500px",
              }}
            />

            {/* Content */}
            <div
              className="
                relative 
                z-10 
                flex 
                min-h-[220px]
                sm:h-full
                items-center 
                justify-center 
                px-5
                sm:px-8
              "
            >
              <div className="max-w-3xl text-center">
                <h2
                  className="
                    text-xl
                    leading-snug
                    sm:text-2xl
                    md:text-3xl
                    lg:text-4xl
                    font
                    text-[#1b1b1f]
                    dark:text-white
                  "
                >
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
