"use client";

import { useTheme } from "next-themes";

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <div>
      <h2
        className="
        text-black dark:text-white
          text-center
          text-2xl
          md:text-3xl
          lg:text-5xl
          font-semibold
          tracking-tight
          leading-[1.15]
          pb-2
        "
      >
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
