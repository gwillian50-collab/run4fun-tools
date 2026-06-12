interface ResultProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export function Result({ label, value, unit, highlight = false }: ResultProps) {
  return (
    <div className={`flex items-baseline justify-between py-3 px-3 rounded-lg ${
      highlight
        ? "bg-accent-dim border border-accent-border"
        : "bg-raised"
    }`}>
      <span className="text-[11px] font-medium text-muted uppercase tracking-[0.06em]">{label}</span>
      <span className={`text-xl font-medium font-mono tabular-nums leading-none ${
        highlight ? "text-accent" : "text-content"
      }`}>
        {value}
        {unit && <span className="text-sm font-normal text-muted ml-1">{unit}</span>}
      </span>
    </div>
  );
}

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
}

export function InputGroup({ label, children }: InputGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-muted uppercase tracking-[0.06em]">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "bg-raised border border-rim text-content rounded-md px-3 py-2.5 text-sm font-medium w-full outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,240,32,0.08)] placeholder-faint tabular-nums transition-[border-color,box-shadow] duration-150";
