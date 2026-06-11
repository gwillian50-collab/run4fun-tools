"use client";
import { useState } from "react";
import { ToolCard } from "../ui/ToolCard";
import { Result, InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { paceToSpeed, speedToPace, formatPace, parsePace } from "@/lib/calculators/pace";

export function PaceSpeedConverter() {
  const [paceInput, setPaceInput] = useState("");
  const [speedInput, setSpeedInput] = useState("");

  function handlePaceChange(val: string) {
    setPaceInput(val);
    setSpeedInput("");
  }

  function handleSpeedChange(val: string) {
    setSpeedInput(val);
    setPaceInput("");
  }

  const paceSeconds = parsePace(paceInput);
  const speed = paceSeconds ? paceToSpeed(paceSeconds) : null;

  const speedNum = parseFloat(speedInput.replace(",", "."));
  const paceFromSpeed =
    !isNaN(speedNum) && speedNum > 0 ? speedToPace(speedNum) : null;

  return (
    <ToolCard title="Pace ↔ Velocidade" icon="⚡">
      <div className="grid grid-cols-2 gap-3">
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

      {speed !== null && (
        <Result label="Velocidade" value={speed.toString()} unit="km/h" highlight />
      )}
      {paceFromSpeed !== null && (
        <Result label="Pace" value={formatPace(paceFromSpeed)} unit="/km" highlight />
      )}
    </ToolCard>
  );
}
