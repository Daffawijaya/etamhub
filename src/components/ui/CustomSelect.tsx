"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const dropRef = useRef<HTMLDivElement>(null);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const selected = options.find((o) => o.value === value);

  // Close on outside click — check both wrapper AND portaled dropdown
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      const clickedWrapper = wrapperRef.current?.contains(target);
      const clickedDropdown = dropRef.current?.contains(target);
      if (!clickedWrapper && !clickedDropdown) {
        setOpen(false);
      }
    }
    // Use mousedown with a small delay so option clicks register first
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  // Calculate dropdown position when opening
  const updatePosition = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    setDropPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, [open, updatePosition]);

  // Close dropdown on any scroll so it doesn't stay fixed on screen
  useEffect(() => {
    if (!open) return;
    function handleScroll() {
      setOpen(false);
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

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

      {/* Dropdown — portal to body so it escapes overflow clipping */}
      {open &&
        createPortal(
          <div
            ref={dropRef}
            data-custom-select
            className="fixed z-[9999] max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-white/[0.08] dark:bg-dark-card dark:shadow-black/40"
            style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(e) => {
                  // Prevent document mousedown from closing before we process
                  e.stopPropagation();
                }}
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
          </div>,
          document.body,
        )}
    </div>
  );
}
