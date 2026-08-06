"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  deskripsi: string;
};

export default function UmkmDescriptionTab({ deskripsi }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      const text = textRef.current;

      if (!container || !text) return;

      setShowButton(text.scrollHeight > container.clientHeight);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [deskripsi]);

  return (
    <>
      <div
        ref={containerRef}
        className={`
          relative
          h-[26.1vh]
          ${
            expanded
              ? `
                overflow-y-auto
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              `
              : "overflow-hidden"
          }
        `}
      >
        <p
          ref={textRef}
          className="
            whitespace-pre-line
            text-sm
            leading-6
            text-zinc-500
            dark:text-zinc-400
          "
        >
          {deskripsi}
        </p>

        {!expanded && showButton && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-10
              bg-gradient-to-t
              from-light
              via-light/90
              to-transparent
              dark:from-[#161616]
              dark:via-[#161616]/90
              dark:to-transparent
            "
          />
        )}
      </div>

      {showButton && (
        <button
          type="button"
          onClick={() => {
            if (expanded) {
              containerRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }

            setExpanded((prev) => !prev);
          }}
          className="
            mt-6
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-violet-600
            transition-all
            duration-300
            hover:bg-violet-500/15
            hover:text-zinc-900
            dark:text-violet-300
            dark:hover:text-white
          "
        >
          {expanded ? "Lihat Lebih Sedikit" : "Baca Selengkapnya"}
        </button>
      )}
    </>
  );
}
