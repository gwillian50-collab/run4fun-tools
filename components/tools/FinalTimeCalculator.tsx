"use client";
import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InfoModal } from "../ui/InfoModal";
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
  const finalTime =
    mode === "time" && paceSeconds && distNum > 0
      ? Math.round(paceSeconds * distNum)
      : null;

  const timeSeconds = parseTime(time);
  const avgPace =
    mode === "pace" && timeSeconds && distNum > 0
      ? Math.round((timeSeconds / distNum))
      : null;

  const infoButton = (
    <button
      onClick={() => setModalOpen(true)}
      aria-label="Como funciona o calculador de tempo?"
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );

  return (
    <>
      <ToolCard title="Tempo & Pace" icon="🏁" action={infoButton}>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("time")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "time" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}
          >
            Calcular Tempo
          </button>
          <button
            onClick={() => setMode("pace")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "pace" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}
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

      <InfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tempo & Pace">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Calcular Tempo Final</span>
          <p>
            Informe a distância e o pace que pretende manter. A calculadora multiplica o pace pela distância e retorna o tempo total estimado para completar o percurso. Útil para simular diferentes ritmos antes de uma prova ou treino.
          </p>
          <p className="mt-1">
            Exemplo: 10 km a 5:30/km → tempo final de 55:00.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Calcular Pace Médio</span>
          <p>
            Informe a distância percorrida e o tempo que você levou. A calculadora divide o tempo total pela distância e retorna o seu pace médio. Ideal para analisar treinos e provas já realizados.
          </p>
          <p className="mt-1">
            Exemplo: 10 km em 52:00 → pace médio de 5:12/km.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Para que serve na prática</span>
          <p>
            Use antes de provas para definir qual pace sustentado te leva ao seu tempo objetivo. Use após treinos para entender seu ritmo real e comparar com o planejado.
          </p>
        </div>
      </InfoModal>
    </>
  );
}
