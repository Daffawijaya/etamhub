interface Props {
  name: string;
  placeholder: string;
  value: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  pattern?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  readOnly?: boolean;
}

export default function FormField({
  name,
  placeholder,
  value,
  required = false,
  onChange,
  type = "text",
  pattern,
  maxLength,
  readOnly,
  inputMode,
}: Props) {
  return (
    <input
      name={name}
      type={type}
      readOnly={readOnly}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
      inputMode={inputMode}
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
