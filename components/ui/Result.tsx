interface ResultProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export function Result({ label, value, unit, highlight = false }: ResultProps) {
  return (
    <div className={`flex items-baseline justify-between py-2 px-3 rounded-xl ${highlight ? "bg-white/10 border border-white/20" : "bg-zinc-800/60"}`}>
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xl font-bold tabular-nums text-white">
        {value}
        {unit && <span className="text-sm font-normal text-zinc-400 ml-1">{unit}</span>}
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
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 placeholder-zinc-600 tabular-nums";
