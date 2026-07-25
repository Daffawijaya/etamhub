interface Props {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: Props) {
  return (
    <section className="space-y-4">
      <h2
        className="
font-semibold
text-slate-800
dark:text-white
"
      >
        {title}
      </h2>

      {children}
    </section>
  );
}
