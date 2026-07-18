// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function ScrollTop() {
//   const pathname = usePathname();

//   useEffect(() => {
//     // Kalau URL mengandung hash (#kecamatan), biarkan browser handle
//     if (window.location.hash) return;

//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "instant" as ScrollBehavior,
//     });
//   }, [pathname]);

//   return null;
// }
