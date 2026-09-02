"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const line = "Ribuan peluang usaha dimulai dari pelaku lokal yang terus tumbuh dan berkembang";

export default function InsightSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const orbX = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#e7e7f1] dark:bg-transparent transition-colors">
      <div>
        {/* FRAME */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden p-[5px] sm:p-[8px] md:p-[14px]"
        >
          {/* Gradient Frame — animated shimmer */}
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
              backgroundSize: "200% 100%",
            }}
          />

          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 0.4 }}
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
              backgroundSize: "200% 100%",
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

            {/* Gold glow — parallax + drift */}
            <motion.div
              style={{ y, x: orbX } as any}
              animate={{ opacity: [0.78, 0.95, 0.78], scale: [1, 1.04, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 left-1/2 h-24 w-[300px] sm:h-32 sm:w-[500px] md:w-[700px] -translate-x-1/2"
              aria-hidden
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #b98d58, #a56c44, #6a3747, #56316d, transparent)",
                  filter: "blur(55px)",
                  opacity: 0.85,
                }}
              />
            </motion.div>

            {/* Purple glow */}
            <motion.div
              style={{ y: orbY } as any}
              animate={{ x: [0, 14, 0], y: [0, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[5%] sm:right-[18%] top-2 h-40 w-40 sm:h-56 sm:w-56 rounded-full"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "#bda4d8",
                  filter: "blur(90px)",
                  opacity: 0.35,
                }}
              />
            </motion.div>

            <motion.div
              animate={{ x: [0, -12, 0], y: [0, 8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute right-[5%] sm:right-[18%] top-2 h-40 w-40 sm:h-56 sm:w-56 rounded-full hidden dark:block"
              style={{
                background: "#59387a",
                filter: "blur(90px)",
                opacity: 0.4,
              }}
            />

            {/* Orange glow */}
            <motion.div
              style={{ y } as any}
              animate={{ x: [0, -16, 0], y: [0, 10, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[15%] sm:left-[35%] top-4 h-40 w-40 sm:h-56 sm:w-56 rounded-full"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "#d8b27b",
                  filter: "blur(90px)",
                  opacity: 0.35,
                }}
              />
            </motion.div>

            <motion.div
              animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute left-[15%] sm:left-[35%] top-4 h-40 w-40 sm:h-56 sm:w-56 rounded-full hidden dark:block"
              style={{
                background: "#b5824c",
                filter: "blur(90px)",
                opacity: 0.35,
              }}
            />

            {/* Dark blur bottom */}
            <div
              className="absolute bottom-[-60px] left-1/2 h-32 w-[400px] sm:h-40 sm:w-[600px] md:w-[850px] -translate-x-1/2 rounded-full"
              style={{
                background: "#cfd0d8",
                filter: "blur(90px)",
                opacity: 0.8,
              }}
            />

            <div
              className="absolute bottom-[-60px] left-1/2 h-32 w-[400px] sm:h-40 sm:w-[600px] md:w-[850px] -translate-x-1/2 rounded-full hidden dark:block"
              style={{
                background: "#101012",
                filter: "blur(90px)",
                opacity: 0.96,
              }}
            />

            {/* Noise */}
            <motion.div
              animate={{ x: [0, -12, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: "url('/grian.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "500px",
              }}
            />

            {/* Content — word stagger */}
            <div className="relative z-10 flex min-h-[220px] sm:h-full items-center justify-center px-5 sm:px-8">
              <div className="max-w-3xl text-center">
                <motion.h2
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.18 } },
                  }}
                  className="text-xl leading-snug sm:text-2xl md:text-3xl lg:text-4xl font text-[#1b1b1f] dark:text-white flex flex-wrap justify-center gap-x-[0.28em] gap-y-1"
                >
                  {line.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { y: 18, opacity: 0, filter: "blur(6px)" },
                        visible: {
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>

                {/* tiny accent */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-6 h-px w-12 origin-center bg-[#1b1b1f]/15 dark:bg-white/20"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
