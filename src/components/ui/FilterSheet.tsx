"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterSheetProps {
  /** Number of active filters (for badge count) */
  activeCount: number;
  /** The filter content to render inside the panel */
  children: ReactNode;
  /** Called when user taps "Reset" */
  onReset: () => void;
  /** Called when user taps "Apply" or closes */
  onApply: () => void;
}

export default function FilterSheet({
  activeCount,
  children,
  onReset,
  onApply,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [panelPos, setPanelPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Calculate popover position from trigger button
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPanelPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  }, []);

  useEffect(() => {
    if (open && !isMobile) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [open, isMobile, updatePosition]);

  const close = useCallback(() => {
    setOpen(false);
    onApply();
  }, [onApply]);

  const handleReset = useCallback(() => {
    onReset();
    close();
  }, [onReset, close]);

  // Close on outside click (desktop popover)
  useEffect(() => {
    if (!open || isMobile) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      // Don't close if click is inside a CustomSelect portal dropdown
      if ((target as HTMLElement)?.closest?.("[data-custom-select]")) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, isMobile, close]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, close]);

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          relative flex h-10 shrink-0 items-center gap-1.5
          rounded-xl border px-3
          text-sm font-medium
          transition-colors
          active:scale-95
          ${
            open
              ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-dark-card dark:text-white dark:hover:bg-white/[0.04]"
          }
        `}
      >
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Mobile: Bottom Sheet ── */}
      {open && isMobile && (
        <div
          ref={backdropRef}
          onClick={(e) => e.target === backdropRef.current && close()}
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-dark-card"
            style={{
              animation: "slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-white/[0.06]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Filter
                {activeCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </h3>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: "calc(85vh - 140px)" }}
            >
              <div className="space-y-4">{children}</div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 border-t border-slate-100 px-5 py-4 dark:border-white/[0.06]">
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                Reset
              </button>
              <button
                onClick={close}
                className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-700"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop: Popover (fixed positioned) ── */}
      {open && !isMobile && (
        <>
          {/* Transparent backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-[998]" />

          <div
            ref={panelRef}
            className="z-[999] w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-white/[0.08] dark:bg-dark-card dark:shadow-black/40"
            style={{ animation: "popoverIn 0.15s ease-out", maxHeight: 'min(80vh, 480px)', display: 'flex', flexDirection: 'column', position: 'fixed', top: panelPos.top, right: panelPos.right }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Filter
                {activeCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </h3>
              <button
                onClick={close}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">{children}</div>
            </div>

            {/* Bottom Actions — always visible, never clipped */}
            <div className="shrink-0 flex gap-2 border-t border-slate-100 px-4 py-3 dark:border-white/[0.06]">
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                Reset
              </button>
              <button
                onClick={close}
                className="flex-1 rounded-xl bg-sky-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
              >
                Terapkan
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes popoverIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
