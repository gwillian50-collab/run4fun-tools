"use client";
import { useMemo } from "react";
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

  // First pass: raw paces via linear interpolation
  const raw: { pace: number; seg: number }[] = [];
  for (let i = 0; i < totalSegments; i++) {
    const isLast = i === totalSegments - 1;
    const seg = isLast && partial > 0.001 ? partial : 1;
    const position = totalSegments > 1 ? i / (totalSegments - 1) : 0.5;
    const multiplier = 1 + (variation / 100) * (2 * position - 1);
    raw.push({ pace: avgPace * multiplier, seg });
  }

  // Normalize so sum(pace * seg) = targetSeconds exactly
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
  if (Number.isInteger(km)) return `${km} km`;
  return `${km} km`;
}

export function RacePlanner() {
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

  const targetSeconds = parseTime(time);

  const splits = useMemo(
    () =>
      distanceKm && targetSeconds
        ? calculateSplits(distanceKm, targetSeconds, variation)
        : [],
    [distanceKm, targetSeconds, variation]
  );

  const avgPace =
    distanceKm && targetSeconds
      ? Math.round(targetSeconds / distanceKm)
      : null;

  const firstPace = splits.length > 0 ? splits[0].pace : null;
  const lastPace = splits.length > 0 ? splits[splits.length - 1].pace : null;

  const strategyLabel =
    variation < -2 ? "Negativa" : variation > 2 ? "Positiva" : "Uniforme";
  const strategyColor =
    variation < -2
      ? "text-green-400"
      : variation > 2
      ? "text-yellow-400"
      : "text-zinc-300";

  return (
    <ToolCard title="Planejador de Prova" icon="📋">
      <InputGroup label="Distância">
        <div>
          <div className="text-xs text-zinc-500 text-center mb-1">Prova</div>
          <select
            className={selectClass}
            value={selectedDist}
            onChange={(e) => setSelectedDist(e.target.value)}
          >
            <option value="">Selecionar...</option>
            {RACE_DISTANCES.map((d) => (
              <option key={d.label} value={String(d.meters)}>
                {d.label}
              </option>
            ))}
            <option value="custom">Personalizada (km)</option>
          </select>
        </div>
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
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500">← Negativa</span>
              <span className={`text-xs font-semibold ${strategyColor}`}>
                {strategyLabel}
              </span>
              <span className="text-xs text-zinc-500">Positiva →</span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              step={1}
              value={variation}
              onChange={(e) => setVariation(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <div className="flex justify-between text-xs tabular-nums text-zinc-400">
              <span>
                1º km:{" "}
                <span className="text-zinc-200 font-semibold">
                  {firstPace ? formatPace(firstPace) : "--"}/km
                </span>
              </span>
              {avgPace && (
                <span>
                  Médio:{" "}
                  <span className="text-zinc-200 font-semibold">
                    {formatPace(avgPace)}/km
                  </span>
                </span>
              )}
              <span>
                Último:{" "}
                <span className="text-zinc-200 font-semibold">
                  {lastPace ? formatPace(lastPace) : "--"}/km
                </span>
              </span>
            </div>
          </div>

          {splits.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-3 px-3 pb-1">
                <span className="text-xs text-zinc-600">Km</span>
                <span className="text-xs text-zinc-600 text-center">Pace</span>
                <span className="text-xs text-zinc-600 text-right">
                  Acumulado
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                {splits.map((s) => {
                  const highlight = s.isCheckpoint || s.isFinish;
                  return (
                    <div
                      key={s.km}
                      className={`grid grid-cols-3 items-center rounded-xl px-3 py-2 ${
                        highlight
                          ? "bg-white/10 border border-white/20"
                          : "bg-zinc-800/60"
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          highlight
                            ? "text-white font-semibold"
                            : "text-zinc-400"
                        }`}
                      >
                        {s.isFinish && !Number.isInteger(s.km)
                          ? "Chegada"
                          : formatKmLabel(s.km)}
                      </span>
                      <span className="text-sm font-bold tabular-nums text-white text-center">
                        {formatPace(s.pace)}/km
                      </span>
                      <span className="text-xs tabular-nums text-zinc-300 text-right">
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
