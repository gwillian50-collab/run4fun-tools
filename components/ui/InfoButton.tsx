interface InfoButtonProps {
  onClick: () => void;
  label?: string;
}

export function InfoButton({ onClick, label = "Informações" }: InfoButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-5 h-5 rounded-full border border-rim-strong text-muted hover:border-accent hover:text-accent transition-colors duration-150 text-[10px] font-medium flex items-center justify-center shrink-0"
    >
      i
    </button>
  );
}
