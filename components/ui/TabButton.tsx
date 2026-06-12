interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        active ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}
