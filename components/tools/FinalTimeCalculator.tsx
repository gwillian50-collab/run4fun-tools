"use client";
import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InfoButton } from "../ui/InfoButton";
import { InfoModal } from "../ui/InfoModal";
import { TabButton } from "../ui/TabButton";
import { Result, InputGroup, inputClass } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parsePace, parseTime, formatTime, formatPace } from "@/lib/calculators/pace";

export function FinalTimeCalculator() {
  const [distance, setDistance] = useLocalStorage("r4f_ft_distance", "");
  const [pace, setPace] = useLocalStorage("r4f_ft_pace", "");
  const [time, setTime] = useLocalStorage("r4f_ft_time", "");
  const [mode, setMode] = useLocalStorage<"time" | "pace">("r4f_ft_mode", "time");
  const [modalOpen, setModalOpen] = useState(false);

  const distNum = parseFloat(distance.replace(",", "."));
  const paceSeconds = parsePace(pace);
  const timeSeconds = parseTime(time);

  const finalTime = mode === "time" && paceSeconds && distNum > 0 ? Math.round(paceSeconds * distNum) : null;
  const avgPace = mode === "pace" && timeSeconds && distNum > 0 ? Math.round(timeSeconds / distNum) : null;

  return (
    <>
      <ToolCard title="Tempo & Pace" icon="🏁" action={<InfoButton onClick={() => setModalOpen(true)} label="Como funciona o calculador de tempo?" />}>
        <div className="flex gap-2">
          <TabButton label="Calcular Tempo" active={mode === "time"} onClick={() => setMode("time")} />
          <TabButton label="Calcular Pace" active={mode === "pace"} onClick={() => setMode("pace")} />
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

        {finalTime !== null && <Result label="Tempo Final" value={formatTime(finalTime)} highlight />}
        {avgPace !== null && <Result label="Pace Médio" value={formatPace(avgPace)} unit="/km" highlight />}
      </ToolCard>

      <InfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tempo & Pace">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Calcular Tempo Final</span>
          <p>Informe a distância e o pace que pretende manter. A calculadora multiplica o pace pela distância e retorna o tempo total estimado. Útil para simular diferentes ritmos antes de uma prova.</p>
          <p className="text-zinc-500">Exemplo: 10 km a 5:30/km → tempo final de 55:00.</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Calcular Pace Médio</span>
          <p>Informe a distância percorrida e o tempo que você levou. A calculadora retorna o seu pace médio. Ideal para analisar treinos e provas já realizados.</p>
          <p className="text-zinc-500">Exemplo: 10 km em 52:00 → pace médio de 5:12/km.</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Na prática</span>
          <p>Use antes de provas para definir qual pace te leva ao seu tempo objetivo. Use após treinos para comparar o ritmo real com o planejado.</p>
        </div>
      </InfoModal>
    </>
  );
}
