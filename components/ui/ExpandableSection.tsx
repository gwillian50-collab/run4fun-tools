import type { RefObject, ReactNode } from "react";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  detailsRef?: RefObject<HTMLDetailsElement | null>;
}

export function ExpandableSection({ title, children, detailsRef }: ExpandableSectionProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <details ref={detailsRef} className="group">
        <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none select-none">
          <span className="text-sm font-semibold text-zinc-200">{title}</span>
          <span className="text-zinc-500 text-lg transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="px-4 pb-4 flex flex-col gap-4 text-sm text-zinc-400 leading-relaxed">
          {children}
        </div>
      </details>
    </div>
  );
}
