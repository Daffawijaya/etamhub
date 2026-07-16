export default function FooterBrand() {
  return (
    <section className="relative h-[120px] sm:h-[170px] md:h-[230px] lg:h-[300px] overflow-hidden bg-dark">
      {/* Fade atas */}
      <div className="absolute inset-x-0 top-0 h-10 bg-dark z-10" />

      {/* Tulisan besar */}
      <div className="absolute inset-x-0 bottom-[-15%] flex justify-center">
        <div
          className="
            px-4
            sm:px-8
            md:px-10
            whitespace-nowrap
            select-none
            font-extrabold
            tracking-wide
            leading-none
            text-[100px]
            sm:text-[150px]
            md:text-[320px]
            lg:text-[300px]
          "
          style={{
            color: "#242428",
            opacity: 0.95,
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)",
          }}
        >
          etamhub
        </div>
      </div>
    </section>
  );
}
