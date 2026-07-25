interface Props {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function FormField({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}: Props) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
      w-full
      rounded-xl
      border
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-dark
      text-slate-900
      dark:text-white
      placeholder:text-slate-400
      dark:placeholder:text-slate-500
      px-4
      py-3
      text-sm
      outline-none
      focus:border-pur
      transition
      "
    />
  );
}
