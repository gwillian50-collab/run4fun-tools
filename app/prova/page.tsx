"use client";
import { useRef } from "react";
import { RacePlanner } from "@/components/tools/RacePlanner";

export default function ProvaPage() {
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
      aria-label="Por que planejar a prova?"
      className="w-6 h-6 rounded-full border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 transition-colors text-xs font-bold flex items-center justify-center"
    >
      i
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4 pb-24">
      <RacePlanner action={infoButton} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <details ref={detailsRef} className="group">
          <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none select-none">
            <span className="text-sm font-semibold text-zinc-200">Por que planejar a prova?</span>
            <span className="text-zinc-500 text-lg transition-transform group-open:rotate-45">+</span>
          </summary>

          <div className="px-4 pb-4 flex flex-col gap-4 text-sm text-zinc-400 leading-relaxed">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">A importância do planejamento</span>
              <p>
                Correr sem um plano de ritmo é um dos erros mais comuns em provas. Sair mais rápido do que o previsto nos primeiros quilômetros, impulsionado pela adrenalina e pelo movimento da largada, pode comprometer toda a segunda metade da prova. Planejar significa chegar na largada sabendo exatamente como distribuir seu esforço — e isso faz diferença no resultado final.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Split negativo vs. positivo</span>

              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Split Negativo</span>
                  <span className="text-xs text-zinc-500">segunda metade mais rápida</span>
                </div>
                <p className="text-zinc-400">
                  Você começa em ritmo conservador e acelera progressivamente. A energia é melhor gerenciada, o glicogênio não é queimado precocemente e você termina forte — sensação de domínio sobre a prova.
                </p>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-xs text-green-400 font-medium">Prós: maior controle, melhor aproveitamento das reservas, menos risco de "quebrar".</span>
                  <span className="text-xs text-zinc-500">Contras: exige experiência e disciplina para segurar o ritmo no início, especialmente em largadas animadas.</span>
                </div>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Split Positivo</span>
                  <span className="text-xs text-zinc-500">segunda metade mais lenta</span>
                </div>
                <p className="text-zinc-400">
                  Você sai em ritmo acima do previsto e desacelera ao longo da prova. É o padrão mais comum entre iniciantes e pode levar ao temido "muro" — quando o glicogênio acaba e o ritmo despenca nos quilômetros finais.
                </p>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-xs text-zinc-500">Prós: sensação inicial de facilidade, pode funcionar bem em distâncias curtas com boa base de treino.</span>
                  <span className="text-xs text-red-400 font-medium">Contras: alto risco de colapso no final, desgaste muscular prematuro e tempo final comprometido.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como usar o planejador</span>
              <p>
                Escolha sua distância e tempo objetivo, depois ajuste o slider de variação. Deslizar para a esquerda simula um split negativo — ritmos iniciais mais lentos, aceleração progressiva. Para a direita, um split positivo. A linha uniforme (centro) distribui o ritmo igualmente em todos os quilômetros. Use a tabela de splits como referência no GPS durante a prova.
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
          <span className="text-sm font-semibold text-white">Se prepare para sua prova</span>
          <span className="text-xs text-zinc-500">Monte seu plano de treinos personalizado</span>
        </div>
        <span className="text-zinc-400 text-lg">→</span>
      </a>
    </div>
  );
}
