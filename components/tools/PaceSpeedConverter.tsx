"use client";
import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InfoModal } from "../ui/InfoModal";
import { InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { paceToSpeed, speedToPace, formatPace, parsePace } from "@/lib/calculators/pace";

export function PaceSpeedConverter() {
  const [paceInput, setPaceInput] = useLocalStorage("r4f_ps_pace", "");
  const [speedInput, setSpeedInput] = useLocalStorage("r4f_ps_speed", "");
  const [modalOpen, setModalOpen] = useState(false);

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

  const infoButton = (
    <button
      onClick={() => setModalOpen(true)}
      aria-label="O que é pace e velocidade?"
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );

  return (
    <>
      <ToolCard title="Pace ↔ Velocidade" icon="⚡" action={infoButton}>
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

      <InfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pace e Velocidade">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">O que é pace?</span>
          <p>
            Pace é o tempo que você leva para percorrer 1 km — expresso em minutos e segundos por quilômetro (min:seg/km). É a unidade preferida de corredores porque conecta diretamente o esforço à distância percorrida. Um pace de 5:30/km significa que você demora 5 minutos e 30 segundos para completar cada quilômetro.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">O que é velocidade?</span>
          <p>
            Velocidade é a distância percorrida por hora, em quilômetros por hora (km/h). É a unidade usada por esteiras e ciclocomputadores. Um pace de 5:30/km equivale a aproximadamente 10,9 km/h.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">A relação entre os dois</span>
          <p>
            Pace e velocidade são inversamente proporcionais — quanto menor o pace (menos tempo por km), maior a velocidade. A conversão é direta: velocidade (km/h) = 60 ÷ pace (min/km). Use esta ferramenta para converter um valor no outro instantaneamente.
          </p>
        </div>
      </InfoModal>
    </>
  );
}
