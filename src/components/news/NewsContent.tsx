"use client";

import { motion } from "framer-motion";

type Props = { content: string };

export default function NewsContent({ content }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-base leading-8 text-slate-700 dark:text-slate-300 [&_p]:mb-5 [&_strong]:font-bold [&_em]:italic [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-emerald-600 [&_a]:underline dark:[&_a]:text-emerald-400"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
