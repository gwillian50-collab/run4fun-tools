interface ToolCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ToolCard({ title, icon, children, action }: ToolCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex-1">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
