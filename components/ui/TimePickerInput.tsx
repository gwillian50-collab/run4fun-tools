"use client";
import { useState, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from "react";

export const selectClass =
  "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-white focus:border-white outline-none appearance-none text-center text-sm font-bold tabular-nums";

const inputCls =
  "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-white focus:border-white outline-none text-center text-sm font-bold tabular-nums placeholder-zinc-600";

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

function clampDigits(d: string, mode: "pace" | "duration"): string {
  if (mode === "pace") {
    if (d.length >= 3) {
      const s = parseInt(d.slice(-2), 10);
      if (s > 59) return d.slice(0, -2) + "59";
    }
    return d;
  }
  let r = d;
  if (r.length >= 3) {
    const m = parseInt(r.slice(1, 3), 10);
    if (m > 59) r = r[0] + "59" + r.slice(3);
  }
  if (r.length >= 5) {
    const s = parseInt(r.slice(3, 5), 10);
    if (s > 59) r = r.slice(0, 3) + "59";
  }
  return r;
}

// pace: last 2 digits = seconds, rest = minutes  →  "5:30", "15:30"
// duration: H:MM:SS (5 digits max)               →  "1:30:00", "0:45:00"
function formatDigits(d: string, mode: "pace" | "duration"): string {
  if (!d) return "";
  if (mode === "pace") {
    if (d.length <= 2) return d;
    return d.slice(0, d.length - 2) + ":" + d.slice(-2);
  }
  if (d.length === 1) return d;
  if (d.length === 2) return d[0] + ":" + d[1];
  if (d.length === 3) return d[0] + ":" + d.slice(1);
  if (d.length === 4) return d[0] + ":" + d.slice(1, 3) + ":" + d[3];
  return d[0] + ":" + d.slice(1, 3) + ":" + d.slice(3);
}

function valueToDigits(value: string, mode: "pace" | "duration"): string {
  if (!value) return "";
  if (mode === "pace") return onlyDigits(value).slice(0, 4);
  const parts = value.split(":");
  // Legacy "MM:SS" (2-part, h=0) → prepend "0" for hours
  if (parts.length === 2) {
    const mm = (parts[0] || "0").padStart(2, "0");
    const ss = (parts[1] || "0").padStart(2, "0");
    return ("0" + mm + ss).slice(0, 5);
  }
  return onlyDigits(value).slice(0, 5);
}

// Only emit when the entry is unambiguously parseable
function toOutput(d: string, mode: "pace" | "duration"): string {
  const min = mode === "pace" ? 3 : 5;
  if (d.length < min) return "";
  return formatDigits(d, mode);
}

export interface TimePickerInputProps {
  value: string;
  onChange: (v: string) => void;
  mode?: "pace" | "duration";
  className?: string;
}

export function TimePickerInput({
  value,
  onChange,
  mode = "pace",
  className = "",
}: TimePickerInputProps) {
  const maxD = mode === "pace" ? 4 : 5;
  const placeholder = mode === "pace" ? "0:00" : "0:00:00";

  const [digits, setDigits] = useState(() => valueToDigits(value, mode));

  // Sync from parent only for non-empty values to avoid clearing mid-entry
  useEffect(() => {
    if (!value) return;
    const d = valueToDigits(value, mode);
    setDigits(d);
  }, [value, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = useCallback(
    (raw: string) => {
      const c = clampDigits(raw.slice(0, maxD), mode);
      setDigits(c);
      onChange(toOutput(c, mode));
    },
    [mode, maxD, onChange]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      commit(onlyDigits(e.target.value));
    },
    [commit]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        commit(digits.slice(0, -1));
      }
    },
    [digits, commit]
  );

  return (
    <div className={className}>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatDigits(digits, mode)}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={inputCls}
        aria-label={mode === "pace" ? "Pace min:seg/km" : "Duração hh:mm:ss"}
      />
    </div>
  );
}
