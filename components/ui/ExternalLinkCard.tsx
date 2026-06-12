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
      className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 active:scale-95 transition-all px-4 py-4"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-xs text-zinc-500">{description}</span>
      </div>
      <span className="text-zinc-400 text-lg">→</span>
    </a>
  );
}
