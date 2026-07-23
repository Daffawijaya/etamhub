"use client";

interface SelectProps {
  name: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function Select({
  name,
  value,
  options,
  placeholder,
  onChange,
}: SelectProps) {
  const sortedOptions = [...options].sort((a, b) => {
    if (a === "Lainnya") return 1;
    if (b === "Lainnya") return -1;

    return a.localeCompare(b, "id");
  });

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          appearance-none

          rounded-xl

          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-dark

          px-4
          py-3
          pr-10

          text-sm

          text-slate-700
          dark:text-white

          outline-none

          transition-colors
          duration-300

          focus:border-[#1184CA]
          focus:ring-1
          focus:ring-[#1184CA]/20
        "
      >
        <option
          value=""
          className="
            bg-white
            dark:bg-dark
            text-slate-900
            dark:text-white
          "
        >
          {placeholder ?? `Pilih ${name}`}
        </option>

        {sortedOptions.map((option) => (
          <option
            key={option}
            value={option}
            className="
              bg-white
              dark:bg-dark
              text-slate-900
              dark:text-white
            "
          >
            {option}
          </option>
        ))}
      </select>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          h-4
          w-4
          -translate-y-1/2

          text-slate-500
          dark:text-slate-400

          transition-colors
          duration-300
        "
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
