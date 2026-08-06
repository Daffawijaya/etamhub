"use client";

import {
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  Info,
  LoaderCircle,
} from "lucide-react";
import type { ModalVariant } from "./types";

type ModalIconProps = {
  variant: ModalVariant;
};

export function ModalIcon({ variant }: ModalIconProps) {
  const iconClass = "h-12 w-12";

  switch (variant) {
    case "success":
      return <CheckCircle2 className={iconClass} />;

    case "error":
      return <CircleAlert className={iconClass} />;

    case "warning":
      return <CircleAlert className={iconClass} />;

    case "info":
      return <Info className={iconClass} />;

    case "confirm":
      return <CircleHelp className={iconClass} />;

    case "loading":
      return <LoaderCircle className={`${iconClass} animate-spin`} />;

    default:
      return null;
  }
}
