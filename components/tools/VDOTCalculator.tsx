"use client";
import { useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup } from "../ui/Result";
import { TimePickerInput, selectClass } from "../ui/TimePickerInput";
import { parseTime, formatPace } from "@/lib/calculators/pace";
import { calculateVDOT, getTrainingPaces } from "@/lib/calculators/vdot";
import { calculateEquivalents, RACE_DISTANCES } from "@/lib/calculators/tools";

export function VDOTCalculator() {
  const [distance, setDistance] = useLocalStorage("r4f_vdot_distance", "");
  const [time, setTime] = useLocalStorage("r4f_vdot_time", "");
  const [tab, setTab] = useLocalStorage<"equiv" | "paces">("r4f_vdot_tab", "equiv");

  const timeSeconds = parseTime(time);
  const distNum = parseFloat(distance);

  const vdot = useMemo(() => {
    if (!timeSeconds || !distNum || distNum <= 0) return null;
    return calculateVDOT(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  const isExample = vdot === null;
  const exampleVdot = useMemo(() => calculateVDOT(10000, 3000), []);
  const displayVdot = vdot ?? exampleVdot;
  const equivalents = useMemo(() => calculateEquivalents(displayVdot), [displayVdot]);
  const paces = useMemo(() => getTrainingPaces(displayVdot), [displayVdot]);

  return (
    <ToolCard title="VDOT & Treinos" icon="📊">
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

      <div className={`flex flex-col gap-4 ${isExample ? "opacity-30 pointer-events-none select-none" : ""}`}>
        <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3">
          <span className="text-sm text-zinc-200 font-medium">VDOT</span>
          <div className="flex items-center gap-2">
            {isExample && <span className="text-xs text-zinc-400 font-medium">exemplo</span>}
            <span className="text-3xl font-black text-white tabular-nums">{displayVdot.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("equiv")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "equiv" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}
          >
            Equivalências
          </button>
          <button
            onClick={() => setTab("paces")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "paces" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}
          >
            Ritmos de Treino
          </button>
        </div>

        {tab === "equiv" && (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-3 px-3 pb-1">
              <span className="text-xs text-zinc-600">Distância</span>
              <span className="text-xs text-zinc-600 text-center">Tempo</span>
              <span className="text-xs text-zinc-600 text-right">Pace</span>
            </div>
            {equivalents.map((eq) => (
              <div key={eq.label} className="grid grid-cols-3 items-center bg-zinc-800/60 rounded-xl px-3 py-2">
                <span className="text-xs text-zinc-300">{eq.label}</span>
                <span className="text-sm font-bold tabular-nums text-white text-center">{eq.time}</span>
                <span className="text-xs text-zinc-400 text-right">{eq.pace}</span>
              </div>
            ))}
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
    </ToolCard>
  );
}
