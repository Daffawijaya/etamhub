"use client";

import { motion } from "framer-motion";
import SectionHeader from "../textBlock/SectionHeader";
import ExploreButton from "../button/ExploreButton";
import UmkmCard from "../district/UmkmCard";

type BadgeData = {
  level: "none" | "bronze" | "silver" | "gold" | "platinum";
  label: string;
  color: string;
  bgColor: string;
} | null;

type Umkm = {
  id: string;
  nama: string;
  subkategori: string;
  deskripsi: string;
  gambar: string[];
};

export default function UmkmTerbaruAnimated({
  umkms,
  badges,
}: {
  umkms: Umkm[];
  badges: Record<string, BadgeData>;
}) {
  return (
    <section id="terbaru" className="bg-light-bg dark:bg-dark py-8 sm:py-10 md:py-16 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            title="UMKM Terbaru"
            description="Pelaku usaha yang baru bergabung dan memperkenalkan produk serta layanannya melalui etamhub."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.085, delayChildren: 0.12 } } }}
          className="mt-10 sm:mt-12 md:mt-20 grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
        >
          {umkms.map((umkm) => (
            <motion.div
              key={umkm.id}
              variants={{
                hidden: { opacity: 0, y: 22, filter: "blur(6px)", scale: 0.98 },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <UmkmCard
                id={umkm.id}
                nama={umkm.nama}
                subkategori={umkm.subkategori}
                deskripsi={umkm.deskripsi}
                gambar={umkm.gambar}
                badge={badges[umkm.id] ?? null}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full pt-12 flex justify-center"
        >
          <ExploreButton />
        </motion.div>
      </div>
    </section>
  );
}
