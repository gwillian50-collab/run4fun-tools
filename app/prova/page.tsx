"use client";
import { RacePlanner } from "@/components/tools/RacePlanner";
import { InfoButton } from "@/components/ui/InfoButton";
import { ExpandableSection } from "@/components/ui/ExpandableSection";
import { ExternalLinkCard } from "@/components/ui/ExternalLinkCard";
import { useExpandable } from "@/lib/useExpandable";

export default function ProvaPage() {
  const { ref, open } = useExpandable();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4 pb-24">
      <RacePlanner action={<InfoButton onClick={open} label="Por que planejar a prova?" />} />

      <ExpandableSection title="Por que planejar a prova?" detailsRef={ref}>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">A importância do planejamento</span>
          <p>Correr sem um plano de ritmo é um dos erros mais comuns em provas. Sair mais rápido do que o previsto nos primeiros quilômetros, impulsionado pela adrenalina da largada, pode comprometer toda a segunda metade. Planejar significa chegar na largada sabendo exatamente como distribuir o esforço.</p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Split negativo vs. positivo</span>

          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Split Negativo</span>
              <span className="text-xs text-zinc-500">segunda metade mais rápida</span>
            </div>
            <p className="text-zinc-400">Você começa conservador e acelera progressivamente. A energia é melhor gerenciada, o glicogênio não é queimado precocemente e você termina forte.</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-xs text-green-400 font-medium">Prós: maior controle, melhor aproveitamento das reservas, menos risco de "quebrar".</span>
              <span className="text-xs text-zinc-500">Contras: exige disciplina para segurar o ritmo no início, especialmente em largadas animadas.</span>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Split Positivo</span>
              <span className="text-xs text-zinc-500">segunda metade mais lenta</span>
            </div>
            <p className="text-zinc-400">Você sai em ritmo acima do previsto e desacelera ao longo da prova. É o padrão mais comum entre iniciantes e pode levar ao temido "muro" nos quilômetros finais.</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-xs text-zinc-500">Prós: sensação inicial de facilidade, pode funcionar em distâncias curtas com boa base de treino.</span>
              <span className="text-xs text-red-400 font-medium">Contras: alto risco de colapso no final, desgaste muscular prematuro e tempo final comprometido.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como usar o planejador</span>
          <p>Escolha sua distância e tempo objetivo, depois ajuste o slider de variação. Deslizar para a esquerda simula um split negativo — começo mais lento, aceleração progressiva. Para a direita, um split positivo. Use a tabela de splits como referência no GPS durante a prova.</p>
        </div>
      </ExpandableSection>

      <ExternalLinkCard
        href="https://run4fun-coach.vercel.app/"
        title="Se prepare para sua prova"
        description="Monte seu plano de treinos personalizado"
      />
    </div>
  );
}
