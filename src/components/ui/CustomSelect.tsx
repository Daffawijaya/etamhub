"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  name,
  required = false,
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={`
          w-full
          rounded-xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-dark
          px-4 pr-10
          py-3
          text-left
          text-sm
          font-medium
          text-slate-900
          dark:text-white
          outline-none
          transition-colors
          duration-300
          hover:border-slate-300
          dark:hover:border-slate-700
          focus:border-sky-500
          focus:ring-1
          focus:ring-sky-500/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        `}
      >
        <span className={!selected ? "text-slate-400 dark:text-slate-500" : ""}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            z-50
            mt-2
            w-full
            max-h-64
            overflow-y-auto
            rounded-xl
            border
            border-slate-200
            dark:border-white/[0.08]
            bg-white
            dark:bg-dark-card
            shadow-lg
            shadow-slate-200/50
            dark:shadow-black/40
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`
                w-full
                px-3 py-2.5
                text-left
                text-sm
                font-medium
                transition-colors
                duration-150
                border-b
                border-slate-100
                dark:border-white/[0.04]
                last:border-b-0
                ${
                  value === option.value
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
