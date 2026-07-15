export default function BottomGlow() {
  return (
    <>
      {/* Bottom Left Grey Glow */}
      <div
        className="
          absolute
          -bottom-[420px]
          -left-[420px]
          w-[1100px]
          h-[900px]
          rounded-full
          pointer-events-none
        "
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(95,105,110,0.35) 0%, rgba(70,75,80,0.22) 35%, rgba(40,40,40,0.12) 55%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle Right Bottom Glow */}
      <div
        className="
          absolute
          -bottom-[300px]
          right-[-300px]
          w-[900px]
          h-[700px]
          rounded-full
          pointer-events-none
        "
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(90,90,90,0.12) 0%, rgba(50,50,50,0.08) 40%, transparent 75%)",
          filter: "blur(70px)",
        }}
      />
    </>
  );
}
