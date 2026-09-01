import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "xs" | "icon";

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  // Primary (Purple) — main CTA: Simpan, Tambah, Submit
  primary: "bg-brand-primary text-white hover:opacity-90 shadow-sm",
  // Secondary (Magenta) — secondary emphasis: actions needing attention
  secondary: "bg-brand-secondary text-white hover:opacity-90 shadow-sm",
  // Accent (Green) — approval/success: Setujui, Approve
  accent: "bg-brand-accent text-white hover:opacity-90 shadow-sm",
  // Danger — destructive: Hapus, Tolak
  danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
  // Ghost — cancel/reset: Batal, Reset
  ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10",
  // Outline — neutral bordered: secondary actions in forms
  outline:
    "border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05] bg-white dark:bg-transparent",
};

const sizeStyles: Record<Size, string> = {
  xs: "px-2.5 py-1.5 text-xs rounded-lg",
  sm: "px-3 py-2 text-xs sm:px-4 sm:text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-5 py-3 text-sm sm:text-base rounded-lg",
  icon: "p-2 rounded-lg",
};

export default function BrandButton({
  variant = "primary",
  size = "sm",
  loading = false,
  icon,
  disabled,
  className = "",
  children,
  ...props
}: BrandButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all duration-150
        active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
