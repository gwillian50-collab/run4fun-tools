"use client";
import { useState, useMemo } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { parseTime, formatPace } from "@/lib/calculators/pace";
import { calculateVDOT, getTrainingPaces } from "@/lib/calculators/vdot";
import { calculateEquivalents } from "@/lib/calculators/tools";

const DISTANCES = [
  { label: "1500m", value: 1500 },
  { label: "1 Milha", value: 1609 },
  { label: "3 km", value: 3000 },
  { label: "5 km", value: 5000 },
  { label: "10 km", value: 10000 },
  { label: "21.1 km", value: 21097 },
  { label: "42.2 km", value: 42195 },
];

export function VDOTCalculator() {
  const [distance, setDistance] = useState("5000");
  const [time, setTime] = useState("");
  const [tab, setTab] = useState<"equiv" | "paces">("equiv");

  const timeSeconds = parseTime(time);
  const distNum = parseFloat(distance);

  const vdot = useMemo(() => {
    if (!timeSeconds || !distNum || distNum <= 0) return null;
    return calculateVDOT(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  const equivalents = useMemo(() => (vdot ? calculateEquivalents(vdot) : []), [vdot]);
  const paces = useMemo(() => (vdot ? getTrainingPaces(vdot) : null), [vdot]);

  return (
    <ToolCard title="VDOT & Treinos" icon="📊">
      <InputGroup label="Distância">
        <div className="flex gap-2 flex-wrap">
          {DISTANCES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDistance(d.value.toString())}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                distance === d.value.toString()
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <input
          className={inputClass}
          placeholder="metros (ex: 5000)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </InputGroup>

      <InputGroup label="Tempo (h:mm:ss ou mm:ss)">
        <input
          className={inputClass}
          placeholder="29:51"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </InputGroup>

      {vdot !== null && (
        <>
          <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3">
            <span className="text-sm text-orange-300 font-medium">VDOT</span>
            <span className="text-3xl font-black text-orange-400 tabular-nums">{vdot.toFixed(1)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTab("equiv")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "equiv" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
            >
              Equivalências
            </button>
            <button
              onClick={() => setTab("paces")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "paces" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
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
                { label: "Interval (I)", sub: "Ritmo de intervalo", value: `${formatPace(paces.interval)}/km`, color: "text-orange-400" },
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
        </>
      )}
    </ToolCard>
  );
}
