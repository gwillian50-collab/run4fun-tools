interface InfoButtonProps {
  onClick: () => void;
  label?: string;
}

export function InfoButton({ onClick, label = "Informações" }: InfoButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );
}
