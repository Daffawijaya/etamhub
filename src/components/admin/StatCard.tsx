import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-black/5
        bg-white
        p-6
       
        transition-all
        duration-300
        hover:-translate-y-1
       
        dark:border-white/10
        dark:bg-[#181818]
      "
    >
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{
          backgroundColor: color,
        }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-bold text-black dark:text-white">
            {value.toLocaleString("id-ID")}
          </h3>
        </div>

        <div
          className="rounded-2xl p-3"
          style={{
            backgroundColor: `${color}20`,
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-10"
        style={{
          backgroundColor: color,
        }}
      />
    </div>
  );
}
