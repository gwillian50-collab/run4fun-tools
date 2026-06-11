"use client";
import { useState } from "react";
import { ToolCard } from "../ui/ToolCard";
import { Result, InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parsePace, parseTime, formatTime, formatPace } from "@/lib/calculators/pace";


export function FinalTimeCalculator() {
  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"time" | "pace">("time"); // what to calculate

  const distNum = parseFloat(distance.replace(",", "."));

  // Calculate final time
  const paceSeconds = parsePace(pace);
  const finalTime =
    mode === "time" && paceSeconds && distNum > 0
      ? Math.round(paceSeconds * distNum)
      : null;

  // Calculate pace
  const timeSeconds = parseTime(time);
  const avgPace =
    mode === "pace" && timeSeconds && distNum > 0
      ? Math.round((timeSeconds / distNum))
      : null;

  return (
    <ToolCard title="Tempo & Pace" icon="🏁">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("time")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "time" ? "bg-lime-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
        >
          Calcular Tempo
        </button>
        <button
          onClick={() => setMode("pace")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "pace" ? "bg-lime-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
        >
          Calcular Pace
        </button>
      </div>

      <InputGroup label="Distância (km)">
        <input
          className={inputClass}
          placeholder="ex: 10"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </InputGroup>

      {mode === "time" ? (
        <InputGroup label="Pace (min:seg/km)">
          <TimePickerInput mode="pace" value={pace} onChange={setPace} />
        </InputGroup>
      ) : (
        <InputGroup label="Tempo total">
          <TimePickerInput mode="duration" value={time} onChange={setTime} />
        </InputGroup>
      )}

      {finalTime !== null && (
        <Result label="Tempo Final" value={formatTime(finalTime)} highlight />
      )}
      {avgPace !== null && (
        <Result label="Pace Médio" value={formatPace(avgPace)} unit="/km" highlight />
      )}
    </ToolCard>
  );
}
