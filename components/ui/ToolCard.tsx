interface ToolCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ToolCard({ title, children, action }: ToolCardProps) {
  return (
    <div className="bg-surface border border-rim rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-0.5 h-3.5 bg-accent rounded-full shrink-0" />
        <h2 className="text-[11px] font-medium text-muted uppercase tracking-[0.08em] flex-1">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
