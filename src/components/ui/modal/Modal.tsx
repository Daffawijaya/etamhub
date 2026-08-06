"use client";

import { X } from "lucide-react";
import { ModalIcon } from "./icons";
import type { ModalState } from "./types";

type ModalProps = {
  modal: ModalState;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({
  modal,
  onClose,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!modal.open) return null;

  const isLoading = modal.variant === "loading";

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
        animate-in
        fade-in
        duration-200
      "
      onClick={() => {
        if (modal.closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-sm
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
          dark:bg-zinc-900
          animate-in
          fade-in
          zoom-in-95
          slide-in-from-bottom-4
          duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {!isLoading && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              rounded-full
              p-1
              text-zinc-400
              transition
              hover:bg-zinc-100
              hover:text-zinc-700
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-200
            "
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          {modal.variant && (
            <div
              className="
                mb-4
                animate-in
                zoom-in-75
                duration-300
              "
            >
              <ModalIcon variant={modal.variant} />
            </div>
          )}

          <h2
            className="
              text-lg
              font-semibold
              text-zinc-900
              dark:text-white
            "
          >
            {modal.title}
          </h2>

          {modal.description && (
            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-zinc-500
                dark:text-zinc-400
              "
            >
              {modal.description}
            </p>
          )}

          {modal.content && <div className="mt-4 w-full">{modal.content}</div>}

          {!isLoading && (
            <div
              className="
                mt-6
                flex
                w-full
                gap-3
                animate-in
                fade-in
                slide-in-from-bottom-2
                duration-300
              "
            >
              {modal.showCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="
                    flex-1
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-zinc-700
                    transition
                    hover:bg-zinc-100
                    dark:text-zinc-200
                    dark:hover:bg-zinc-800
                  "
                >
                  {modal.cancelText ?? "Batal"}
                </button>
              )}

              <button
                type="button"
                onClick={onConfirm}
                className={`
                  flex-1
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  active:scale-[0.98]

                  ${
                    modal.confirmButtonVariant === "danger"
                      ? `
                        bg-red-600
                        hover:bg-red-700
                        dark:bg-red-500
                        dark:hover:bg-red-600
                      `
                      : `
                        bg-emerald-600
                        hover:bg-emerald-700
                        dark:bg-emerald-500
                        dark:hover:bg-emerald-600
                      `
                  }
                `}
              >
                {modal.confirmText ?? "OK"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
