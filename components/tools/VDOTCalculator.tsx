"use client";
import { useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { TabButton } from "../ui/TabButton";
import { InputGroup } from "../ui/Result";
import { TimePickerInput, selectClass } from "../ui/TimePickerInput";
import { parseTime, formatPace } from "@/lib/calculators/pace";
import { calculateVDOT, getTrainingPaces } from "@/lib/calculators/vdot";
import { calculateEquivalents, RACE_DISTANCES } from "@/lib/calculators/tools";

const PRIMARY_LABELS = new Set(["Maratona", "Meia Maratona", "10 km", "5 km"]);

export function VDOTCalculator({ action }: { action?: ReactNode }) {
  const [distance, setDistance] = useLocalStorage("r4f_vdot_distance", "");
  const [time, setTime] = useLocalStorage("r4f_vdot_time", "");
  const [tab, setTab] = useLocalStorage<"equiv" | "paces">("r4f_vdot_tab", "equiv");

  const timeSeconds = useMemo(() => {
    if (!time || time.split(":").length < 3) return null;
    return parseTime(time);
  }, [time]);
  const distNum = parseFloat(distance);

  const vdot = useMemo(() => {
    if (!timeSeconds || !distNum || distNum <= 0) return null;
    return calculateVDOT(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  const equivalents = useMemo(() => vdot ? calculateEquivalents(vdot) : [], [vdot]);
  const paces = useMemo(() => vdot ? getTrainingPaces(vdot) : null, [vdot]);

  const sortedEquivalents = useMemo(() => [
    ...equivalents.filter((e) => PRIMARY_LABELS.has(e.label)),
    ...equivalents.filter((e) => !PRIMARY_LABELS.has(e.label)),
  ], [equivalents]);

  return (
    <ToolCard title="VDOT & Treinos" icon="📊" action={action}>
      <InputGroup label="Distância">
        <div>
          <div className="text-xs text-zinc-500 text-center mb-1">Prova</div>
          <select
            className={selectClass}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          >
            <option value="">Selecionar...</option>
            {RACE_DISTANCES.map((d) => (
              <option key={d.label} value={String(d.meters)}>{d.label}</option>
            ))}
          </select>
        </div>
      </InputGroup>

      <InputGroup label="Tempo">
        <TimePickerInput mode="duration" value={time} onChange={setTime} />
      </InputGroup>

      <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3">
        <span className="text-sm text-zinc-200 font-medium">VDOT</span>
        <span className="text-3xl font-black tabular-nums text-white transition-all duration-300">
          {vdot !== null ? vdot.toFixed(1) : "—"}
        </span>
      </div>

      {vdot !== null && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <TabButton label="Equivalências" active={tab === "equiv"} onClick={() => setTab("equiv")} />
            <TabButton label="Ritmos de Treino" active={tab === "paces"} onClick={() => setTab("paces")} />
          </div>

          {tab === "equiv" && (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-3 px-3 pb-1">
                <span className="text-xs text-zinc-600">Distância</span>
                <span className="text-xs text-zinc-600 text-center">Tempo</span>
                <span className="text-xs text-zinc-600 text-right">Pace</span>
              </div>
              {sortedEquivalents.map((eq, i) => {
                const isPrimary = PRIMARY_LABELS.has(eq.label);
                const prevIsPrimary = i > 0 && PRIMARY_LABELS.has(sortedEquivalents[i - 1].label);
                const showDivider = !isPrimary && prevIsPrimary;
                return (
                  <div key={eq.label}>
                    {showDivider && <div className="border-t border-zinc-700/50 my-1" />}
                    <div className={`grid grid-cols-3 items-center rounded-xl px-3 py-2 ${isPrimary ? "bg-zinc-800/80" : "bg-zinc-800/40"}`}>
                      <span className={`text-xs font-medium ${isPrimary ? "text-zinc-100" : "text-zinc-500"}`}>{eq.label}</span>
                      <span className={`tabular-nums font-bold text-center ${isPrimary ? "text-base text-white" : "text-sm text-zinc-400"}`}>{eq.time}</span>
                      <span className={`text-xs text-right ${isPrimary ? "text-zinc-300" : "text-zinc-600"}`}>{eq.pace}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "paces" && paces && (
            <div className="flex flex-col gap-2">
              {[
                { label: "Easy (E)", sub: "Corrida confortável", value: `${formatPace(paces.easy.min)} – ${formatPace(paces.easy.max)}/km`, color: "text-green-400" },
                { label: "Maratona (M)", sub: "Pace de maratona", value: `${formatPace(paces.marathon)}/km`, color: "text-blue-400" },
                { label: "Threshold (T)", sub: "Ritmo de limiar", value: `${formatPace(paces.threshold)}/km`, color: "text-yellow-400" },
                { label: "Interval (I)", sub: "Ritmo de intervalo", value: `${formatPace(paces.interval)}/km`, color: "text-white" },
                { label: "Repetition (R)", sub: "Pace de repetição", value: `${formatPace(paces.repetition)}/km`, color: "text-red-400" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-3 py-2.5">
                  <div>
                    <div className="text-sm font-semibold text-white">{p.label}</div>
                    <div className="text-xs text-zinc-500">{p.sub}</div>
                  </div>
                  <span className={`text-base font-bold tabular-nums ${p.color}`}>{p.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}
