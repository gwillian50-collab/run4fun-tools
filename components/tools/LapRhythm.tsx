"use client";
import { useState } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parsePace } from "@/lib/calculators/pace";
import { calculateLaps } from "@/lib/calculators/tools";

export function LapRhythm() {
  const [pace, setPace] = useState("");

  const paceSeconds = parsePace(pace);
  const laps = paceSeconds ? calculateLaps(paceSeconds) : [];

  return (
    <ToolCard title="Ritmo por Volta" icon="🔄">
      <InputGroup label="Pace (min:seg/km)">
        <TimePickerInput mode="pace" value={pace} onChange={setPace} />
      </InputGroup>

      {laps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {laps.map((lap) => {
            const isKm = lap.label === "1 km";
            return (
              <div
                key={lap.label}
                className={`flex justify-between items-center rounded-xl px-3 py-2 ${
                  isKm
                    ? "bg-white/10 border border-white/20"
                    : "bg-zinc-800/60"
                }`}
              >
                <span className={`text-xs ${isKm ? "text-zinc-200 font-semibold" : "text-zinc-400"}`}>
                  {lap.label}
                </span>
                <span className={`tabular-nums font-bold ${isKm ? "text-xl text-white" : "text-base text-white"}`}>
                  {lap.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </ToolCard>
  );
}
