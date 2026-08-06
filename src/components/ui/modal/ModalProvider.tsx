"use client";

import { useCallback, useState } from "react";

import Modal from "./Modal";
import { ModalContext } from "./modal-context";

import type { ModalOptions, ModalState } from "./types";

type Resolver = (value: boolean) => void;

let confirmResolver: Resolver | null = null;

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    title: "",
    variant: "info",
  });

  const close = useCallback(() => {
    setModal((prev) => ({
      ...prev,
      open: false,
    }));

    confirmResolver = null;
  }, []);

  const show = useCallback((options: ModalOptions) => {
    setModal({
      open: true,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "info",
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      showCancel: options.showCancel ?? false,
      confirmButtonVariant: options.confirmButtonVariant,
      closeOnBackdrop: options.closeOnBackdrop ?? true,
      content: options.content,
    });
  }, []);

  const confirm = useCallback((options: ModalOptions) => {
    return new Promise<boolean>((resolve) => {
      confirmResolver = resolve;

      setModal({
        open: true,
        title: options.title,
        description: options.description,
        variant: "confirm",
        confirmText: options.confirmText ?? "Konfirmasi",
        cancelText: options.cancelText ?? "Batal",
        showCancel: true,
        confirmButtonVariant: options.confirmButtonVariant ?? "primary",
        closeOnBackdrop: options.closeOnBackdrop ?? true,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmResolver) {
      confirmResolver(true);
    }

    close();
  }, [close]);

  const handleCancel = useCallback(() => {
    if (confirmResolver) {
      confirmResolver(false);
    }

    close();
  }, [close]);

  const success = useCallback(
    (options: Omit<ModalOptions, "variant">) => {
      show({
        ...options,
        variant: "success",
      });
    },
    [show],
  );

  const error = useCallback(
    (options: Omit<ModalOptions, "variant">) => {
      show({
        ...options,
        variant: "error",
      });
    },
    [show],
  );

  const warning = useCallback(
    (options: Omit<ModalOptions, "variant">) => {
      show({
        ...options,
        variant: "warning",
      });
    },
    [show],
  );

  const info = useCallback(
    (options: Omit<ModalOptions, "variant">) => {
      show({
        ...options,
        variant: "info",
      });
    },
    [show],
  );

  const loading = useCallback(
    (options: Omit<ModalOptions, "variant">) => {
      show({
        ...options,
        variant: "loading",
        closeOnBackdrop: false,
      });
    },
    [show],
  );

  return (
    <ModalContext.Provider
      value={{
        show,
        confirm,
        success,
        error,
        warning,
        info,
        loading,
        close,
      }}
    >
      {children}

      <Modal
        modal={modal}
        onClose={close}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
}
