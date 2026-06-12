"use client";
import { useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parseTime } from "@/lib/calculators/pace";
import { calculateGoals } from "@/lib/calculators/tools";

export function GoalPredictor() {
  const [distance, setDistance] = useLocalStorage("r4f_goal_distance", "");
  const [time, setTime] = useLocalStorage("r4f_goal_time", "");

  const timeSeconds = parseTime(time);
  const distNum = parseFloat(distance);

  const goals = useMemo(() => {
    if (!timeSeconds || !distNum) return [];
    return calculateGoals(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  return (
    <ToolCard title="Preditor de Metas">
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
        <div className="flex flex-col">
          <div className="grid grid-cols-2 px-3 pb-2">
            <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em]">Meta</span>
            <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em] text-right">Pace necessário</span>
          </div>
          <div className="flex flex-col">
            {goals.map((g, i) => (
              <div
                key={g.label}
                className={`flex justify-between items-center px-3 py-2 rounded-md ${
                  i === 0 ? "bg-raised border border-rim-strong my-0.5" : ""
                }`}
              >
                <span className={`${i === 0 ? "text-[13px] font-medium text-content" : "text-[11px] text-muted"}`}>
                  {g.label}
                </span>
                <span className={`font-mono tabular-nums font-medium ${i === 0 ? "text-[13px] text-accent" : "text-[11px] text-muted"}`}>
                  {g.pace}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}
