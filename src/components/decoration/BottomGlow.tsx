export default function BottomGlow() {
  return (
    <div
      className="
        absolute
        left-1/2
        bottom-[-500px]
        -translate-x-1/2

        w-[2500px]
        h-[1000px]

        rounded-full
        pointer-events-none
      "
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.02) 55%, transparent 75%)",
        filter: "blur(120px)",
      }}
    />
  );
}