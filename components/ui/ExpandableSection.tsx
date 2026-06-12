import type { RefObject, ReactNode } from "react";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  detailsRef?: RefObject<HTMLDetailsElement | null>;
}

export function ExpandableSection({ title, children, detailsRef }: ExpandableSectionProps) {
  return (
    <div className="rounded-xl border border-rim bg-surface overflow-hidden">
      <details ref={detailsRef} className="group">
        <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none select-none">
          <span className="text-[13px] font-medium text-content">{title}</span>
          <span className="text-muted text-base transition-transform duration-150 group-open:rotate-45">+</span>
        </summary>
        <div className="px-4 pb-4 flex flex-col gap-4 text-[13px] text-muted leading-relaxed border-t border-rim">
          {children}
        </div>
      </details>
    </div>
  );
}
