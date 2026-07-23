"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="text-lg cursor-pointer"
    >
      {resolvedTheme === "dark" ? (
        <IoIosSunny className="text-white hover:text-zinc-300 duration-200" />
      ) : (
        <IoIosMoon className="text-black hover:text-zinc-700 duration-200" />
      )}
    </button>
  );
}