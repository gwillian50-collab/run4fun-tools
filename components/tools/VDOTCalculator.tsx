"use client";
import { useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ToolCard } from "../ui/ToolCard";
import { TabButton } from "../ui/TabButton";
import { InputGroup } from "../ui/Result";
import { TimePickerInput, selectClass } from "../ui/TimePickerInput";
import { parseTime, formatPace } from "@/lib/calculators/pace";
import { calculateVDOT, getTrainingPaces } from "@/lib/calculators/vdot";
import { calculateEquivalents, RACE_DISTANCES } from "@/lib/calculators/tools";

const PRIMARY_LABELS = new Set(["Maratona", "Meia Maratona", "10 km", "5 km"]);

export function VDOTCalculator({ action }: { action?: ReactNode }) {
  const [distance, setDistance] = useLocalStorage("r4f_vdot_distance", "");
  const [time, setTime] = useLocalStorage("r4f_vdot_time", "");
  const [tab, setTab] = useLocalStorage<"equiv" | "paces">("r4f_vdot_tab", "equiv");

  const timeSeconds = useMemo(() => {
    if (!time || time.split(":").length < 3) return null;
    return parseTime(time);
  }, [time]);
  const distNum = parseFloat(distance);

  const vdot = useMemo(() => {
    if (!timeSeconds || !distNum || distNum <= 0) return null;
    return calculateVDOT(distNum, timeSeconds);
  }, [timeSeconds, distNum]);

  const equivalents = useMemo(() => (vdot ? calculateEquivalents(vdot) : []), [vdot]);
  const paces = useMemo(() => (vdot ? getTrainingPaces(vdot) : null), [vdot]);

  const sortedEquivalents = useMemo(() => [
    ...equivalents.filter((e) => PRIMARY_LABELS.has(e.label)),
    ...equivalents.filter((e) => !PRIMARY_LABELS.has(e.label)),
  ], [equivalents]);

  return (
    <ToolCard title="VDOT & Treinos" action={action}>
      <InputGroup label="Distância">
        <select
          className={selectClass}
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        >
          <option value="">Selecionar...</option>
          {RACE_DISTANCES.map((d) => (
            <option key={d.label} value={String(d.meters)}>{d.label}</option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Tempo">
        <TimePickerInput mode="duration" value={time} onChange={setTime} />
      </InputGroup>

      <div className="flex items-center justify-between bg-raised border border-rim-strong rounded-lg px-4 py-3.5">
        <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">VDOT</span>
        <span
          className="font-mono font-medium tabular-nums leading-none transition-all duration-300"
          style={{ fontSize: "32px", letterSpacing: "-0.02em", color: vdot !== null ? "var(--color-accent)" : "var(--color-faint)" }}
        >
          {vdot !== null ? vdot.toFixed(1) : "—"}
        </span>
      </div>

      {vdot !== null && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <TabButton label="Equivalências" active={tab === "equiv"} onClick={() => setTab("equiv")} />
            <TabButton label="Ritmos de Treino" active={tab === "paces"} onClick={() => setTab("paces")} />
          </div>

          {tab === "equiv" && (
            <div className="flex flex-col">
              <div className="grid grid-cols-3 px-3 pb-2">
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em]">Distância</span>
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em] text-center">Tempo</span>
                <span className="text-[10px] font-medium text-faint uppercase tracking-[0.06em] text-right">Pace</span>
              </div>
              <div className="flex flex-col">
                {sortedEquivalents.map((eq, i) => {
                  const isPrimary = PRIMARY_LABELS.has(eq.label);
                  const prevIsPrimary = i > 0 && PRIMARY_LABELS.has(sortedEquivalents[i - 1].label);
                  return (
                    <div key={eq.label}>
                      {!isPrimary && prevIsPrimary && (
                        <div className="border-t border-rim my-1" />
                      )}
                      <div className={`grid grid-cols-3 items-center px-3 py-2 rounded-md ${isPrimary ? "bg-raised" : ""}`}>
                        <span className={`${isPrimary ? "text-[13px] font-medium text-content" : "text-[11px] text-faint"}`}>
                          {eq.label}
                        </span>
                        <span className={`font-mono tabular-nums text-center ${isPrimary ? "text-[15px] font-medium text-content" : "text-[13px] text-muted"}`}>
                          {eq.time}
                        </span>
                        <span className={`font-mono tabular-nums text-right ${isPrimary ? "text-[11px] text-muted" : "text-[11px] text-faint"}`}>
                          {eq.pace}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "paces" && paces && (
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Easy (E)", sub: "Corrida confortável", value: `${formatPace(paces.easy.min)} – ${formatPace(paces.easy.max)}/km`, color: "text-success" },
                { label: "Maratona (M)", sub: "Pace de maratona", value: `${formatPace(paces.marathon)}/km`, color: "text-blue-400" },
                { label: "Threshold (T)", sub: "Ritmo de limiar", value: `${formatPace(paces.threshold)}/km`, color: "text-warning" },
                { label: "Interval (I)", sub: "Ritmo de intervalo", value: `${formatPace(paces.interval)}/km`, color: "text-content" },
                { label: "Repetition (R)", sub: "Pace de repetição", value: `${formatPace(paces.repetition)}/km`, color: "text-danger" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between bg-raised rounded-md px-3 py-2.5">
                  <div>
                    <div className="text-[13px] font-medium text-content">{p.label}</div>
                    <div className="text-[11px] text-faint">{p.sub}</div>
                  </div>
                  <span className={`text-[13px] font-medium font-mono tabular-nums ${p.color}`}>{p.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}
