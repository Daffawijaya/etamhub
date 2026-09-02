"use client";

import { motion } from "framer-motion";

export default function AboutPlatformSection() {
  const items = [
    {
      title: "Tentang Platform",
      description:
        "etamhub hadir sebagai pusat informasi UMKM Kutai Kartanegara yang membantu masyarakat menemukan produk, layanan, dan potensi usaha lokal dalam satu tempat.",
    },
    {
      title: "Tujuan",
      description:
        "Mendorong transformasi digital UMKM serta memperluas jangkauan promosi produk dan jasa unggulan daerah.",
    },
    {
      title: "Visi",
      description:
        "Menjadi platform digital yang memperkuat ekosistem UMKM Kutai Kartanegara yang terhubung, tumbuh, dan berinovasi.",
    },
    {
      title: "Inisiator & Pengembang",
      description:
        "etamhub diinisiasi dan dikembangkan oleh Tenaga Ahli Pendamping UMKM sebagai upaya mendukung digitalisasi, promosi, dan pengembangan UMKM Kutai Kartanegara secara berkelanjutan.",
    },
  ];

  return (
    <section className="bg-light-bg dark:bg-dark pb-12 md:pb-24 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(6px)", scale: 0.98 },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.24, ease: "easeOut" } }}
              whileTap={{ scale: 0.985 }}
              className="group relative bg-light dark:bg-[#1b1b1b] border border-white dark:border-zinc-800 dark:hover:border-zinc-700 rounded-xl transition-colors duration-300 p-5 sm:p-6 md:p-10 min-h-[180px] sm:min-h-[220px] md:min-h-[280px] flex flex-col justify-center overflow-hidden"
            >
              {/* hover wash */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_55%)]" />
              <h3 className="relative text-xl sm:text-2xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="relative mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
              <motion.div className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-transparent group-hover:from-violet-500/30 group-hover:via-fuchsia-400/20 group-hover:to-transparent transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
