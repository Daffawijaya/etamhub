export default function FooterGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1200px] h-[500px] rounded-full bg-white/[0.03] blur-[180px]" />

      <div className="absolute top-24 left-[-200px] w-[500px] h-[500px] rounded-full bg-slate-300/[0.03] blur-[180px]" />

      <div className="absolute top-24 right-[-200px] w-[500px] h-[500px] rounded-full bg-slate-300/[0.03] blur-[180px]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
