"use client";
import { useRef } from "react";
import { VDOTCalculator } from "@/components/tools/VDOTCalculator";

export default function VDOTPage() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function openInfo() {
    if (detailsRef.current) {
      detailsRef.current.open = true;
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const infoButton = (
    <button
      onClick={openInfo}
      aria-label="O que é o VDOT?"
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4 pb-24">
      <VDOTCalculator action={infoButton} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <details ref={detailsRef} className="group">
          <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none select-none">
            <span className="text-sm font-semibold text-zinc-200">O que é o VDOT?</span>
            <span className="text-zinc-500 text-lg transition-transform group-open:rotate-45">+</span>
          </summary>

          <div className="px-4 pb-4 flex flex-col gap-4 text-sm text-zinc-400 leading-relaxed">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">O conceito</span>
              <p>
                VDOT é um índice criado pelo fisiologista Jack Daniels que representa o seu VO₂max funcional — não o valor real medido em laboratório, mas o que o seu desempenho em prova indica sobre a sua capacidade aeróbica. Quanto maior o VDOT, mais eficiente é o seu sistema aeróbico.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como é calculado</span>
              <p>
                A fórmula usa o seu tempo em uma prova e a distância percorrida para estimar o consumo de oxigênio relativo naquele ritmo. Com isso, o VDOT é derivado comparando esse esforço com tabelas de referência do método Daniels, normalizando diferenças de distância para um único número comparável.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Sobre as equivalências</span>
              <p>
                As equivalências mostram o que o seu VDOT atual sugere como tempo potencial em outras distâncias. Por exemplo: um VDOT 47 (10km em ~45min) equivale a uma meia maratona em torno de 1h40 e uma maratona em torno de 3h30.
              </p>
              <p className="mt-1">
                Esses números são norteadores, não limites. O resultado real em prova depende de fatores como especificidade do treino para a distância, experiência em ritmo de prova, condições climáticas e estratégia de largada. Use as equivalências para guiar seu planejamento, não como teto do seu potencial.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como se encaixa no treino</span>
              <p>
                O VDOT define cinco zonas de treino — Easy, Maratona, Threshold, Interval e Repetition — cada uma com um propósito fisiológico específico. Treinar no ritmo certo para cada zona garante o estímulo adequado sem acumular fadiga desnecessária.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como isso te ajuda a melhorar</span>
              <p>
                Ao respeitar os ritmos calculados pelo seu VDOT atual, você treina de forma personalizada e progressiva. À medida que seu condicionamento melhora, o VDOT sobe e os ritmos se ajustam — criando um ciclo contínuo de evolução baseado no seu próprio desempenho real.
              </p>
            </div>
          </div>
        </details>
      </div>

      <a
        href="https://run4fun-coach.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 active:scale-95 transition-all px-4 py-4"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-white">Planilha de Treinos</span>
          <span className="text-xs text-zinc-500">Monte seu plano personalizado baseado no seu VDOT</span>
        </div>
        <span className="text-zinc-400 text-lg">→</span>
      </a>
    </div>
  );
}
