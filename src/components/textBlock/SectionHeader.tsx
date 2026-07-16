type SectionHeaderProps = {
  title: string;
  description?: string;
};

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <h2
        style={{
          background:
            "linear-gradient(180deg,#ffffff 0%,#e4e4e7 35%,#b4b4b8 75%,#71717a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        className="
    text-center
    text-xl
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
        <p className="mt-3 text-center text-zinc-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
