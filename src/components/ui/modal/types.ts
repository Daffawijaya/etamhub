export type ModalVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "confirm"
  | "loading"
  | "custom";

export type ModalButtonVariant = "primary" | "danger" | "secondary";

export interface ModalOptions {
  title: string;
  description?: string;

  variant?: ModalVariant;

  confirmText?: string;
  cancelText?: string;

  showCancel?: boolean;

  confirmButtonVariant?: ModalButtonVariant;

  closeOnBackdrop?: boolean;

  content?: React.ReactNode;
}

export interface ModalState extends ModalOptions {
  open: boolean;
}

export interface ModalContextValue {
  show: (options: ModalOptions) => void;

  confirm: (options: ModalOptions) => Promise<boolean>;

  success: (options: Omit<ModalOptions, "variant">) => void;

  error: (options: Omit<ModalOptions, "variant">) => void;

  warning: (options: Omit<ModalOptions, "variant">) => void;

  info: (options: Omit<ModalOptions, "variant">) => void;

  loading: (options: Omit<ModalOptions, "variant">) => void;

  close: () => void;
}
