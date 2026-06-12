interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-md text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-150 ${
        active
          ? "bg-accent-dim text-accent border border-accent-border"
          : "bg-raised text-muted border border-rim"
      }`}
    >
      {label}
    </button>
  );
}
