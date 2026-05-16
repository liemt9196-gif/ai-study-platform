"use client";

import { useEffect, useId } from "react";
import { Sidebar } from "@/components/app/sidebar";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40"
        aria-label="Close navigation menu"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 left-0 w-[min(100%,18rem)] shadow-xl"
      >
        <h2 id={titleId} className="sr-only">
          Navigation menu
        </h2>
        <Sidebar onNavigate={onClose} className="h-full w-full" />
      </div>
    </div>
  );
}
