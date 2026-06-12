"use client";
import { useEffect } from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-rim rounded-t-2xl sm:rounded-xl p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-content">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-raised hover:bg-subtle text-muted hover:text-content transition-colors duration-150 flex items-center justify-center text-[11px]"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4 text-[13px] text-muted leading-relaxed border-t border-rim pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
