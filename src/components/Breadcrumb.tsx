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
    <nav className="pb-4">
      <div>


        <div className="relative z-10 flex items-center gap-2 whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="
                      text-zinc-400
                      transition-all
                      duration-300
                      hover:text-violet-300
                    "
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? `
                          font-medium
                          bg-gradient-to-r
                          from-violet-400
                          to-fuchsia-400
                          bg-clip-text
                          text-transparent
                        `
                        : "text-zinc-400"
                    }
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span className="text-zinc-600 select-none">/</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
