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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-200">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4 text-sm text-zinc-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
