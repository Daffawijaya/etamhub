"use client";

import { useContext } from "react";
import { ModalContext } from "./modal-context";

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal harus digunakan di dalam ModalProvider");
  }

  return context;
}
