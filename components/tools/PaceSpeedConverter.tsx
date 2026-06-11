"use client";
import { useState } from "react";
import { ToolCard } from "../ui/ToolCard";
import { InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { paceToSpeed, speedToPace, formatPace, parsePace } from "@/lib/calculators/pace";

export function PaceSpeedConverter() {
  const [paceInput, setPaceInput] = useState("");
  const [speedInput, setSpeedInput] = useState("");

  function handlePaceChange(val: string) {
    setPaceInput(val);
    const ps = parsePace(val);
    setSpeedInput(ps && ps > 0 ? String(paceToSpeed(ps)) : "");
  }

  function handleSpeedChange(val: string) {
    setSpeedInput(val);
    const sp = parseFloat(val.replace(",", "."));
    setPaceInput(!isNaN(sp) && sp > 0 ? formatPace(speedToPace(sp)) : "");
  }

  return (
    <ToolCard title="Pace ↔ Velocidade" icon="⚡">
      <div className="flex flex-col gap-3">
        <InputGroup label="Pace (min:seg/km)">
          <TimePickerInput
            mode="pace"
            value={paceInput}
            onChange={handlePaceChange}
          />
        </InputGroup>
        <InputGroup label="Velocidade (km/h)">
          <input
            className={inputClass}
            placeholder="10.9"
            value={speedInput}
            onChange={(e) => handleSpeedChange(e.target.value)}
          />
        </InputGroup>
      </div>
    </ToolCard>
  );
}
