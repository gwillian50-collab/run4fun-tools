"use client";
import { VDOTCalculator } from "@/components/tools/VDOTCalculator";
import { InfoButton } from "@/components/ui/InfoButton";
import { ExpandableSection } from "@/components/ui/ExpandableSection";
import { ExternalLinkCard } from "@/components/ui/ExternalLinkCard";
import { useExpandable } from "@/lib/useExpandable";

export default function VDOTPage() {
  const { ref, open } = useExpandable();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4 pb-24">
      <p className="text-sm text-zinc-500 leading-relaxed px-1">
        Informe sua distância e tempo em uma prova recente para calcular seu VDOT e ver seus ritmos de treino ideais.
      </p>
      <VDOTCalculator action={<InfoButton onClick={open} label="O que é o VDOT?" />} />

      <ExpandableSection title="O que é o VDOT?" detailsRef={ref}>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">O conceito</span>
          <p>VDOT é um índice criado pelo fisiologista Jack Daniels que representa o seu VO₂max funcional — não o valor medido em laboratório, mas o que o seu desempenho em prova indica sobre a sua capacidade aeróbica. Quanto maior o VDOT, mais eficiente é o seu sistema aeróbico.</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como é calculado</span>
          <p>A fórmula usa o seu tempo em uma prova e a distância percorrida para estimar o consumo de oxigênio relativo naquele ritmo, normalizando as diferenças entre distâncias em um único número comparável.</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Sobre as equivalências</span>
          <p>As equivalências mostram o potencial estimado em outras distâncias com o seu VDOT atual. Por exemplo: VDOT 47 (10km em ~45min) equivale a uma meia maratona em torno de 1h40 e uma maratona em torno de 3h30.</p>
          <p className="text-zinc-500 mt-1">Esses números são norteadores, não limites. Resultados reais dependem de especificidade do treino, clima e estratégia de prova.</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Os ritmos de treino</span>
          <p>O VDOT define cinco zonas, cada uma com um propósito fisiológico distinto:</p>
          <div className="flex flex-col gap-2 mt-1">
            {[
              { color: "text-green-400", label: "Easy (E)", desc: "A maior parte do volume semanal. Ritmo confortável onde é possível conversar. Desenvolve a base aeróbica, capilares musculares e eficiência no uso de gordura como combustível." },
              { color: "text-blue-400", label: "Maratona (M)", desc: "Ritmo-alvo de maratona. Longões específicos que desenvolvem a eficiência de combustível e a resistência necessária para provas longas." },
              { color: "text-yellow-400", label: "Threshold (T)", desc: "Limiar lático — o ritmo mais alto que pode ser mantido por cerca de 1 hora. Eleva o teto de velocidade sustentável. Usado em tempo runs de 20–30 min ou cruise intervals." },
              { color: "text-white", label: "Interval (I)", desc: "Maximiza o VO₂max. Esforço intenso de 3–5 min com recuperação ativa igual ao tempo do esforço. Melhora a capacidade aeróbica máxima." },
              { color: "text-red-400", label: "Repetition (R)", desc: "Mais rápido que Interval, com recuperação completa. Foco em economia de corrida e velocidade neuromuscular. Repetições curtas de 200–400m." },
            ].map((z) => (
              <div key={z.label} className="flex gap-3">
                <span className={`text-xs font-bold ${z.color} w-28 shrink-0 pt-0.5`}>{z.label}</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Como isso te ajuda a melhorar</span>
          <p>Respeitando os ritmos do seu VDOT atual, você treina de forma personalizada e progressiva. Conforme o condicionamento melhora, o VDOT sobe e os ritmos se ajustam — um ciclo contínuo de evolução baseado no seu próprio desempenho real.</p>
        </div>
      </ExpandableSection>

      <ExternalLinkCard
        href="https://run4fun-coach.vercel.app/"
        title="Planilha de Treinos"
        description="Monte seu plano personalizado baseado no seu VDOT"
      />
    </div>
  );
}
