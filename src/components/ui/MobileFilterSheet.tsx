"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import BrandButton from "@/components/ui/BrandButton";

interface MobileFilterSheetProps {
  /** Number of active filters (for badge count) */
  activeCount: number;
  /** The filter content to render inside the sheet */
  children: ReactNode;
  /** Called when user taps "Reset" */
  onReset: () => void;
  /** Called when user taps "Apply" or closes */
  onApply: () => void;
}

export default function MobileFilterSheet({
  activeCount,
  children,
  onReset,
  onApply,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [sheetStyle, setSheetStyle] = useState<React.CSSProperties>({
    transform: "translateY(100%)",
    transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
  });

  const openSheet = useCallback(() => {
    setOpen(true);
    // Force reflow then animate
    requestAnimationFrame(() => {
      setSheetStyle({
        transform: "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
      });
    });
  }, []);

  const closeSheet = useCallback(() => {
    setSheetStyle({
      transform: "translateY(100%)",
      transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
    });
    setTimeout(() => setOpen(false), 300);
    onApply();
  }, [onApply]);

  const handleReset = useCallback(() => {
    onReset();
    closeSheet();
  }, [onReset, closeSheet]);

  const handleApply = useCallback(() => {
    closeSheet();
  }, [closeSheet]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        handleApply();
      }
    },
    [handleApply],
  );

  return (
    <>
      {/* Trigger Button — visible on mobile only */}
      <button
        type="button"
        onClick={openSheet}
        className="relative z-20 flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:hidden dark:border-white/[0.06] dark:bg-dark-card dark:text-white dark:hover:bg-white/[0.04]"
      >
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet */}
      {open && (
        <div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm sm:hidden"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            ref={sheetRef}
            style={sheetStyle}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-dark-card"
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
                onClick={handleApply}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(85vh - 140px)" }}>
              <div className="space-y-4">{children}</div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 border-t border-slate-100 px-5 py-4 dark:border-white/[0.06]">
              <BrandButton variant="ghost" size="md" className="flex-1" onClick={handleReset}>
                Reset
              </BrandButton>
              <BrandButton variant="accent" size="md" className="flex-1" onClick={handleApply}>
                Terapkan
              </BrandButton>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
