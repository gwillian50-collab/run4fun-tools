"use client";
import { useState } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { parsePace } from "@/lib/calculators/pace";
import { calculateLaps } from "@/lib/calculators/tools";

export function LapRhythm() {
  const [pace, setPace] = useState("");

  const paceSeconds = parsePace(pace);
  const laps = paceSeconds ? calculateLaps(paceSeconds) : [];

  return (
    <ToolCard title="Ritmo por Volta" icon="🔄">
      <InputGroup label="Pace (min:seg/km)">
        <input
          className={inputClass}
          placeholder="5:30"
          value={pace}
          onChange={(e) => setPace(e.target.value)}
        />
      </InputGroup>

      {laps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {laps.map((lap) => (
            <div
              key={lap.label}
              className="flex justify-between items-center bg-zinc-800/60 rounded-xl px-3 py-2"
            >
              <span className="text-xs text-zinc-400">{lap.label}</span>
              <span className="text-base font-bold tabular-nums text-white">{lap.time}</span>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}
