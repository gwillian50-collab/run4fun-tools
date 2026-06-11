"use client";

const HOURS = Array.from({ length: 10 }, (_, i) => i);
const MINS  = Array.from({ length: 60 }, (_, i) => i);
const SECS  = Array.from({ length: 60 }, (_, i) => i);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string, mode: "pace" | "duration"): { h: number; m: number; s: number } {
  if (!value) return { h: 0, m: 0, s: 0 };
  const parts = value.split(":").map(Number);
  if (mode === "pace") return { h: 0, m: parts[0] ?? 0, s: parts[1] ?? 0 };
  if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] };
  return { h: 0, m: parts[0] ?? 0, s: parts[1] ?? 0 };
}

function formatValue(h: number, m: number, s: number, mode: "pace" | "duration"): string {
  if (mode === "pace") return `${m}:${pad(s)}`;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export interface TimePickerInputProps {
  value: string;
  onChange: (v: string) => void;
  mode?: "pace" | "duration";
  className?: string;
}

const selectClass =
  "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-white focus:border-lime-500 outline-none appearance-none text-center text-sm font-bold tabular-nums";

export function TimePickerInput({
  value,
  onChange,
  mode = "pace",
  className = "",
}: TimePickerInputProps) {
  const { h, m, s } = parseValue(value, mode);

  function emit(field: "h" | "m" | "s", val: number) {
    const next = { h, m, s, [field]: val };
    onChange(formatValue(next.h, next.m, next.s, mode));
  }

  return (
    <div className={`grid gap-2 ${mode === "duration" ? "grid-cols-3" : "grid-cols-2"} ${className}`}>
      {mode === "duration" && (
        <div>
          <div className="text-xs text-zinc-500 text-center mb-1">Horas</div>
          <select className={selectClass} value={h} onChange={(e) => emit("h", Number(e.target.value))}>
            {HOURS.map((i) => <option key={i} value={i}>{pad(i)}</option>)}
          </select>
        </div>
      )}
      <div>
        <div className="text-xs text-zinc-500 text-center mb-1">Minutos</div>
        <select className={selectClass} value={m} onChange={(e) => emit("m", Number(e.target.value))}>
          {MINS.map((i) => <option key={i} value={i}>{pad(i)}</option>)}
        </select>
      </div>
      <div>
        <div className="text-xs text-zinc-500 text-center mb-1">Segundos</div>
        <select className={selectClass} value={s} onChange={(e) => emit("s", Number(e.target.value))}>
          {SECS.map((i) => <option key={i} value={i}>{pad(i)}</option>)}
        </select>
      </div>
    </div>
  );
}
