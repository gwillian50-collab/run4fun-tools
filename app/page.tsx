import { PaceSpeedConverter } from "@/components/tools/PaceSpeedConverter";
import { FinalTimeCalculator } from "@/components/tools/FinalTimeCalculator";
import { LapRhythm } from "@/components/tools/LapRhythm";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4 pb-4">
      <PaceSpeedConverter />
      <FinalTimeCalculator />
      <LapRhythm />
      <footer className="text-center text-xs text-zinc-700 pt-2 pb-2">
        Run4Fun Tools — Cálculos baseados em Jack Daniels&apos; Running Formula
      </footer>
    </div>
  );
}
