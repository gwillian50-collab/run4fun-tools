"use client";
import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { InfoModal } from "../ui/InfoModal";
import { InputGroup } from "../ui/Result";
import { TimePickerInput } from "../ui/TimePickerInput";
import { parsePace } from "@/lib/calculators/pace";
import { calculateLaps } from "@/lib/calculators/tools";

export function LapRhythm() {
  const [pace, setPace] = useLocalStorage("r4f_lap_pace", "");
  const [modalOpen, setModalOpen] = useState(false);

  const paceSeconds = parsePace(pace);
  const laps = paceSeconds ? calculateLaps(paceSeconds) : [];

  const infoButton = (
    <button
      onClick={() => setModalOpen(true)}
      aria-label="O que é ritmo por volta?"
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );

  return (
    <>
      <ToolCard title="Ritmo por Volta" icon="🔄" action={infoButton}>
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

      <InfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Ritmo por Volta">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">O que é uma volta?</span>
          <p>
            Em pistas de atletismo, uma volta padrão tem 400 metros. Treinos intervalados são frequentemente estruturados em voltas — por exemplo, "8 x 400m" ou "4 x 800m" — e saber o tempo alvo por volta é essencial para executar o treino no ritmo correto.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como usar</span>
          <p>
            Insira o seu pace de corrida e a ferramenta calcula automaticamente o tempo correspondente para cada distância de volta comum: 200m, 300m, 400m, 600m, 800m e 1 km. Assim você não precisa fazer a conta na cabeça antes ou durante o treino.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Na prática</span>
          <p>
            Se o seu pace de treino Interval (I) é 4:45/km, cada volta de 400m deve ser completada em aproximadamente 1:54. Use esses valores como referência no cronômetro para calibrar o esforço e manter a consistência entre as repetições.
          </p>
        </div>
      </InfoModal>
    </>
  );
}
