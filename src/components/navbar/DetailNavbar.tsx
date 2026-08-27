"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { navigation } from "@/data/navigation";
import { useRouter } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function DetailNavbar() {
  const router = useRouter();
  const { isLoggedIn, dashboardPath } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav
        className="
          fixed top-0 left-0 z-50
          w-full h-14
          border-b border-white bg-light dark:border-zinc-700 dark:bg-dark/40 backdrop-blur-xl 
        "
      >
        <div className="max-w-7xl mx-auto h-full px-5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-black dark:text-white"
          >
            etamhub.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-black hover:text-black/80 dark:text-white/80 dark:hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => router.push(isLoggedIn ? dashboardPath : "/auth/login")}
              className="
      h-10 px-5 rounded-md
      bg-white text-black
      text-sm font-medium
      transition hover:opacity-90
    "
            >
              {isLoggedIn ? "Dashboard" : "Masuk"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-black dark:text-white text-xl"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu */}
      <div
        className={`
          fixed inset-0 z-[60]
          bg-light dark:bg-dark
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white dark:border-white/10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-bold tracking-wide text-black dark:text-white"
          >
            etamhub.
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <button
              onClick={() => setOpen(false)}
              className="text-black dark:text-white text-3xl"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col px-6 pt-10 gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-black dark:text-white text-xl font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={() => router.push(isLoggedIn ? dashboardPath : "/auth/login")}
            className="
              w-full h-11 rounded-lg
              flex items-center justify-center
              bg-white text-black
              text-sm font-medium
              hover:bg-zinc-200
              transition-colors
            "
          >
            {isLoggedIn ? "Dashboard" : "Masuk"}
          </button>
        </div>
      </div>
    </>
  );
}
