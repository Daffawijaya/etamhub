export default function BottomAccent() {
  return (
    <div
      className="
        absolute
        bottom-0
        left-0
        h-[2px]
        w-full
        origin-left
        scale-x-0
        bg-gradient-to-r
        from-violet-500
        via-fuchsia-400
        to-transparent
        transition-transform
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        group-hover:scale-x-100
      "
    />
  );
}