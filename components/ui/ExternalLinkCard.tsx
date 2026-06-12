interface ExternalLinkCardProps {
  href: string;
  title: string;
  description: string;
}

export function ExternalLinkCard({ href, title, description }: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-rim bg-surface hover:border-rim-strong hover:bg-subtle active:scale-[0.98] transition-all duration-150 px-4 py-4"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-content">{title}</span>
        <span className="text-[11px] text-muted">{description}</span>
      </div>
      <span className="text-muted text-sm ml-3">→</span>
    </a>
  );
}
