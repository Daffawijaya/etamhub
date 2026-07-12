import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 pt-8">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium text-primary"
                    : "text-slate-500"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && <span>›</span>}
          </div>
        );
      })}
    </nav>
  );
}