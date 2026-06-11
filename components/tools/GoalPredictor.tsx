"use client";
import { useState, useMemo } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parseTime } from "@/lib/calculators/pace";
import { calculateGoals } from "@/lib/calculators/tools";


export function GoalPredictor() {
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const timeSeconds = parseTime(time);
  const distNum = parseFloat(distance);

  const goals = useMemo(() => {
    if (!timeSeconds || !distNum) return [];
    return calculateGoals(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  return (
    <ToolCard title="Preditor de Metas" icon="🎯">
      <InputGroup label="Distância">
        <input
          className={inputClass}
          placeholder="metros (ex: 5000)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </InputGroup>

      <InputGroup label="Tempo Atual">
        <TimePickerInput mode="duration" value={time} onChange={setTime} />
      </InputGroup>

      {goals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 px-3 pb-0.5">
            <span className="text-xs text-zinc-600">Meta</span>
            <span className="text-xs text-zinc-600 text-right">Pace necessário</span>
          </div>
          {goals.map((g, i) => (
            <div
              key={g.label}
              className={`flex justify-between items-center rounded-xl px-3 py-2 ${
                i === 0
                  ? "bg-white/10 border border-white/20"
                  : "bg-zinc-800/60"
              }`}
            >
              <span className={`text-sm font-semibold ${i === 0 ? "text-white" : "text-white"}`}>{g.label}</span>
              <span className={`text-sm font-bold tabular-nums ${i === 0 ? "text-zinc-200" : "text-zinc-300"}`}>{g.pace}</span>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}
