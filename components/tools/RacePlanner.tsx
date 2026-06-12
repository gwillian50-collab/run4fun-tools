"use client";
import { useMemo, type ReactNode } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput, selectClass } from "../ui/TimePickerInput";
import { parseTime, formatPace, formatTime } from "@/lib/calculators/pace";
import { RACE_DISTANCES } from "@/lib/calculators/tools";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface Split {
  km: number;
  pace: number;
  cumTime: number;
  isCheckpoint: boolean;
  isFinish: boolean;
}

function calculateSplits(
  distanceKm: number,
  targetSeconds: number,
  variation: number
): Split[] {
  if (distanceKm <= 0 || targetSeconds <= 0) return [];

  const avgPace = targetSeconds / distanceKm;
  const fullKms = Math.floor(distanceKm);
  const partial = Math.round((distanceKm - fullKms) * 1000) / 1000;
  const totalSegments = fullKms + (partial > 0.001 ? 1 : 0);

  const raw: { pace: number; seg: number }[] = [];
  for (let i = 0; i < totalSegments; i++) {
    const isLast = i === totalSegments - 1;
    const seg = isLast && partial > 0.001 ? partial : 1;
    const position = totalSegments > 1 ? i / (totalSegments - 1) : 0.5;
    const multiplier = 1 + (variation / 100) * (2 * position - 1);
    raw.push({ pace: avgPace * multiplier, seg });
  }

  const rawTotal = raw.reduce((s, { pace, seg }) => s + pace * seg, 0);
  const scale = targetSeconds / rawTotal;

  const splits: Split[] = [];
  let cumTime = 0;
  for (let i = 0; i < totalSegments; i++) {
    const { pace: rawPace, seg } = raw[i];
    const pace = rawPace * scale;
    const isLast = i === totalSegments - 1;
    cumTime += pace * seg;
    const kmEnd = Math.round((isLast ? distanceKm : i + 1) * 1000) / 1000;
    splits.push({
      km: kmEnd,
      pace: Math.round(pace),
      cumTime: Math.round(cumTime),
      isCheckpoint: Number.isInteger(kmEnd) && kmEnd % 5 === 0 && !isLast,
      isFinish: isLast,
    });
  }

  return splits;
}

function formatKmLabel(km: number): string {
  return `${km} km`;
}

export function RacePlanner({ action }: { action?: ReactNode }) {
  const [selectedDist, setSelectedDist] = useLocalStorage("r4f_plan_dist", "");
  const [customKm, setCustomKm] = useLocalStorage("r4f_plan_custom", "");
  const [time, setTime] = useLocalStorage("r4f_plan_time", "");
  const [variation, setVariation] = useLocalStorage("r4f_plan_var", 0);

  const distanceKm = useMemo(() => {
    if (selectedDist === "custom") {
      const v = parseFloat(customKm.replace(",", "."));
      return !isNaN(v) && v > 0 ? v : null;
    }
    const m = parseFloat(selectedDist);
    return !isNaN(m) && m > 0 ? m / 1000 : null;
  }, [selectedDist, customKm]);

  const targetSeconds = useMemo(() => {
    if (!time || time.split(":").length < 3) return null;
    return parseTime(time);
  }, [time]);

  const splits = useMemo(
    () => (distanceKm && targetSeconds ? calculateSplits(distanceKm, targetSeconds, variation) : []),
    [distanceKm, targetSeconds, variation]
  );

  const avgPace = distanceKm && targetSeconds ? Math.round(targetSeconds / distanceKm) : null;
  const firstPace = splits.length > 0 ? splits[0].pace : null;
  const lastPace = splits.length > 0 ? splits[splits.length - 1].pace : null;

  const strategyLabel = variation < -2 ? "Negativa" : variation > 2 ? "Positiva" : "Uniforme";
  const strategyColor = variation < -2 ? "text-success" : variation > 2 ? "text-danger" : "text-muted";

  return (
    <ToolCard title="Planejador de Prova" action={action}>
      <InputGroup label="Distância">
        <select
          className={selectClass}
          value={selectedDist}
          onChange={(e) => setSelectedDist(e.target.value)}
        >
          <option value="">Selecionar...</option>
          {RACE_DISTANCES.map((d) => (
            <option key={d.label} value={String(d.meters)}>{d.label}</option>
          ))}
          <option value="custom">Personalizada (km)</option>
        </select>
        {selectedDist === "custom" && (
          <input
            className={inputClass + " mt-2"}
            placeholder="ex: 15.5"
            value={customKm}
            onChange={(e) => setCustomKm(e.target.value)}
          />
        )}
      </InputGroup>

      <InputGroup label="Tempo Objetivo">
        <TimePickerInput mode="duration" value={time} onChange={setTime} />
      </InputGroup>

      {distanceKm && targetSeconds && (
        <>
          {/* Result card */}
          <div className="rounded-xl border border-rim-strong bg-raised px-4 py-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-medium text-muted uppercase tracking-[0.08em] mb-1">Pace médio</div>
                <div className="leading-none flex items-baseline gap-1">
                  <span className="font-mono font-medium tabular-nums text-accent" style={{ fontSize: "30px", letterSpacing: "-0.02em" }}>
                    {avgPace ? formatPace(avgPace) : "—"}
                  </span>
                  <span className="text-[12px] text-muted">/km</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-medium text-muted uppercase tracking-[0.08em] mb-1">Total</div>
                <div className="text-[20px] font-medium font-mono tabular-nums text-content leading-none" style={{ letterSpacing: "-0.01em" }}>
                  {formatTime(targetSeconds)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-rim pt-2.5">
              <span className={`text-[10px] font-medium uppercase tracking-[0.08em] ${strategyColor}`}>{strategyLabel}</span>
              <span className="text-[11px] text-faint">
                {variation < -2 ? "segunda metade mais rápida" : variation > 2 ? "segunda metade mais lenta" : "ritmo constante"}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={-25}
              max={25}
              step={1}
              value={variation}
              onChange={(e) => setVariation(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] tabular-nums text-faint font-mono">
              <span>
                1º km:{" "}
                <span className="text-muted font-medium">
                  {firstPace ? formatPace(firstPace) : "--"}/km
                </span>
              </span>
              <span>
                Último:{" "}
                <span className="text-muted font-medium">
                  {lastPace ? formatPace(lastPace) : "--"}/km
                </span>
              </span>
            </div>
          </div>

          {/* Splits table */}
          {splits.length > 0 && (
            <div className="flex flex-col">
              <div className="grid grid-cols-3 px-3 pb-2">
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em]">Km</span>
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em] text-center">Pace</span>
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em] text-right">Acumulado</span>
              </div>
              <div className="flex flex-col">
                {splits.map((s) => {
                  const highlight = s.isCheckpoint || s.isFinish;
                  return (
                    <div
                      key={s.km}
                      className={`grid grid-cols-3 items-center px-3 py-2 rounded-md ${
                        highlight ? "bg-raised border border-rim-strong my-0.5" : ""
                      }`}
                    >
                      <span className={`${highlight ? "text-[13px] font-medium text-content" : "text-[11px] text-faint"}`}>
                        {s.isFinish && !Number.isInteger(s.km) ? "Chegada" : formatKmLabel(s.km)}
                      </span>
                      <span className={`font-mono tabular-nums text-center ${highlight ? "text-[15px] font-medium text-accent" : "text-[13px] text-muted"}`}>
                        {formatPace(s.pace)}/km
                      </span>
                      <span className={`font-mono tabular-nums text-right ${highlight ? "text-[13px] text-muted" : "text-[11px] text-faint"}`}>
                        {formatTime(s.cumTime)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </ToolCard>
  );
}
