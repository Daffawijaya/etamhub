"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import DaftarModal from "../modal/DaftarModal";
import MobileNavbar from "./MobileNavbar";
import { navigation } from "@/data/navigation";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedIn, dashboardPath } = useAuth();
  const [openDaftarModal, setOpenDaftarModal] = useState(false);

  const [showNavbar, setShowNavbar] = useState(
    pathname === "/peta" || pathname.startsWith("/berita/"),
  );

  useEffect(() => {
    const isMapPage = pathname === "/peta";
    const isNewsDetailPage = pathname.startsWith("/berita/");

    if (isMapPage) {
      setShowNavbar(true);
      return;
    }

    if (isMapPage || isNewsDetailPage) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      setShowNavbar(window.scrollY > 200);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <nav
        className={`hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-500 ease-out ${
          showNavbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-white bg-light dark:border-zinc-700 dark:bg-dark/40 backdrop-blur-xl">
          <div className="md:flex items-center gap-8 pl-[15px] pr-[8px] h-[50px]">
            <Link href="/">
              <span className="text-black dark:text-white text-2xl font-semibold tracking-tight inline-block -translate-y-[2.4px]">
                e.
              </span>
            </Link>

            <div className="flex items-center gap-6">
              {navigation.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <ThemeToggle />

            <button
              onClick={() => router.push(isLoggedIn ? dashboardPath : "/auth/login")}
              className="bg-white text-black px-3 py-2 rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors"
            >
              {isLoggedIn ? "Dashboard" : "Masuk"}
            </button>
          </div>
        </div>
      </nav>

      <MobileNavbar />

      <DaftarModal
        open={openDaftarModal}
        onClose={() => setOpenDaftarModal(false)}
      />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    const hash = href.includes("#") ? href.split("#")[1] : null;
    if (hash && pathname === "/") {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "#" + hash);
    } else if (hash && pathname !== "/") {
      e.preventDefault();
      router.push("/#" + hash);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="text-xs font-medium text-black hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
