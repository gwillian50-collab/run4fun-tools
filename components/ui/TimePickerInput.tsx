"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { inputClass } from "./Result";

const H = 40; // px per item

const PACE_MINS = Array.from({ length: 60 }, (_, i) => `${i}`);
const DUR_MINS  = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));
const SECS      = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));
const HRS       = Array.from({ length: 10 }, (_, i) => `${i}`);

function PickerColumn({
  items,
  selected,
  onSelect,
  label,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progRef  = useRef(false);
  const userRef  = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const prevSelected = useRef(selected);

  // Ref callback: sets initial scrollTop when DOM node appears (handles strict-mode re-mount)
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      ref.current = el;
      if (el) {
        const idx = items.indexOf(selectedRef.current);
        if (idx >= 0) {
          progRef.current = true;
          el.scrollTop = idx * H;
          setTimeout(() => { progRef.current = false; }, 150);
        }
      }
    },
    [items],
  );

  // Sync when selected changes externally
  useEffect(() => {
    if (selected === prevSelected.current) return;
    prevSelected.current = selected;
    if (userRef.current) { userRef.current = false; return; }
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(selected);
    if (idx < 0) return;
    progRef.current = true;
    el.scrollTo({ top: idx * H, behavior: "smooth" });
    const t = setTimeout(() => { progRef.current = false; }, 400);
    return () => clearTimeout(t);
  }, [selected, items]);

  const handleScroll = useCallback(() => {
    if (progRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / H);
      const c = Math.max(0, Math.min(idx, items.length - 1));
      progRef.current = true;
      el.scrollTo({ top: c * H, behavior: "smooth" });
      setTimeout(() => { progRef.current = false; }, 300);
      userRef.current = true;
      onSelect(items[c]);
    }, 80);
  }, [items, onSelect]);

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-x-0 z-10 border-t border-b border-orange-500/40 bg-orange-500/10"
          style={{ top: H, height: H }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-zinc-900 to-transparent"
          style={{ height: H }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-zinc-900 to-transparent"
          style={{ height: H }}
        />
        <div
          ref={setRef}
          onScroll={handleScroll}
          className="picker-scroll overflow-y-scroll"
          style={{
            height: H * 3,
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "y mandatory",
          } as React.CSSProperties}
        >
          <div style={{ height: H }} />
          {items.map((item) => (
            <div
              key={item}
              style={{ height: H, scrollSnapAlign: "center" }}
              className={`flex items-center justify-center text-2xl font-bold tabular-nums transition-colors duration-100 select-none ${
                item === selected ? "text-white" : "text-zinc-600"
              }`}
            >
              {item}
            </div>
          ))}
          <div style={{ height: H }} />
        </div>
      </div>
      <span className="text-xs text-zinc-600 mt-1.5 uppercase tracking-wider">{label}</span>
    </div>
  );
}

type TimeState = { h: number; m: number; s: number };

function parseInput(v: string, mode: "pace" | "duration"): TimeState {
  if (!v) return mode === "pace" ? { h: 0, m: 5, s: 0 } : { h: 0, m: 30, s: 0 };
  const p = v.split(":").map(Number);
  if (mode === "pace") return { h: 0, m: p[0] ?? 5, s: p[1] ?? 0 };
  if (p.length === 3) return { h: p[0], m: p[1], s: p[2] };
  return { h: 0, m: p[0] ?? 30, s: p[1] ?? 0 };
}

function fmtOut(t: TimeState, mode: "pace" | "duration"): string {
  const ss = `${t.s}`.padStart(2, "0");
  if (mode === "pace") return `${t.m}:${ss}`;
  return t.h > 0 ? `${t.h}:${t.m}:${ss}` : `${t.m}:${ss}`;
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const init = parseInput(value, mode);
  const [t, setT] = useState<TimeState>(init);
  const tRef     = useRef<TimeState>(init);
  const lastEmit = useRef("");

  // Sync from external value changes
  useEffect(() => {
    if (!value || value === lastEmit.current) return;
    const parsed = parseInput(value, mode);
    tRef.current = parsed;
    setT(parsed);
  }, [value, mode]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  function openPicker() {
    // If no value yet, emit the default so calculations run immediately
    if (!value) {
      const result = fmtOut(tRef.current, mode);
      lastEmit.current = result;
      onChange(result);
    }
    setIsOpen((prev) => !prev);
  }

  const handleSelect = useCallback(
    (field: "h" | "m" | "s", val: number) => {
      const next = { ...tRef.current, [field]: val };
      tRef.current = next;
      setT(next);
      const result = fmtOut(next, mode);
      lastEmit.current = result;
      onChange(result);
    },
    [mode, onChange],
  );

  const mSel = mode === "pace" ? `${t.m}` : `${t.m}`.padStart(2, "0");
  const displayValue = value || fmtOut(t, mode);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Display box */}
      <button
        type="button"
        onClick={openPicker}
        className={`${inputClass} flex items-center justify-between gap-2 cursor-pointer`}
      >
        <span className={`tabular-nums ${value ? "text-white" : "text-zinc-500"}`}>
          {displayValue}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} text-zinc-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Picker panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-stretch px-2 pt-2 pb-1">
            {mode === "duration" && (
              <>
                <PickerColumn
                  items={HRS}
                  selected={`${t.h}`}
                  onSelect={(v) => handleSelect("h", Number(v))}
                  label="hora"
                />
                <div className="flex items-center justify-center text-zinc-500 font-bold text-2xl w-5 shrink-0 pb-6">
                  :
                </div>
              </>
            )}
            <PickerColumn
              items={mode === "pace" ? PACE_MINS : DUR_MINS}
              selected={mSel}
              onSelect={(v) => handleSelect("m", Number(v))}
              label="min"
            />
            <div className="flex items-center justify-center text-zinc-500 font-bold text-2xl w-5 shrink-0 pb-6">
              :
            </div>
            <PickerColumn
              items={SECS}
              selected={`${t.s}`.padStart(2, "0")}
              onSelect={(v) => handleSelect("s", Number(v))}
              label="seg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
