import type { ModalOptions } from "./types";

export function createModalOptions(options: ModalOptions): ModalOptions {
  return {
    closeOnBackdrop: true,
    showCancel: false,
    confirmText: "OK",
    cancelText: "Batal",
    ...options,
  };
}
