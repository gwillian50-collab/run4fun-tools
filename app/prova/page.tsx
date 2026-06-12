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
      <p className="text-[13px] text-muted leading-relaxed px-1">
        Escolha a distância e seu tempo objetivo para gerar os splits de cada quilômetro. Use o slider para simular estratégias de ritmo negativo, uniforme ou positivo.
      </p>
      <RacePlanner action={<InfoButton onClick={open} label="Por que planejar a prova?" />} />

      <ExpandableSection title="Por que planejar a prova?" detailsRef={ref}>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-content uppercase tracking-[0.07em]">A importância do planejamento</span>
          <p>Correr sem um plano de ritmo é um dos erros mais comuns em provas. Sair mais rápido do que o previsto nos primeiros quilômetros, impulsionado pela adrenalina da largada, pode comprometer toda a segunda metade. Planejar significa chegar na largada sabendo exatamente como distribuir o esforço.</p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-medium text-content uppercase tracking-[0.07em]">Split negativo vs. positivo</span>

          <div className="rounded-lg border border-success/20 bg-success/5 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-success uppercase tracking-[0.07em]">Split Negativo</span>
              <span className="text-[11px] text-faint">segunda metade mais rápida</span>
            </div>
            <p>Você começa conservador e acelera progressivamente. A energia é melhor gerenciada, o glicogênio não é queimado precocemente e você termina forte.</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-[11px] text-success">Prós: maior controle, melhor aproveitamento das reservas, menos risco de &quot;quebrar&quot;.</span>
              <span className="text-[11px] text-faint">Contras: exige disciplina para segurar o ritmo no início, especialmente em largadas animadas.</span>
            </div>
          </div>

          <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-danger uppercase tracking-[0.07em]">Split Positivo</span>
              <span className="text-[11px] text-faint">segunda metade mais lenta</span>
            </div>
            <p>Você sai em ritmo acima do previsto e desacelera ao longo da prova. É o padrão mais comum entre iniciantes e pode levar ao temido &quot;muro&quot; nos quilômetros finais.</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-[11px] text-faint">Prós: sensação inicial de facilidade, pode funcionar em distâncias curtas com boa base de treino.</span>
              <span className="text-[11px] text-danger">Contras: alto risco de colapso no final, desgaste muscular prematuro e tempo final comprometido.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-content uppercase tracking-[0.07em]">Como usar o planejador</span>
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
