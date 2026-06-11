import Image from "next/image";
import { PaceSpeedConverter } from "@/components/tools/PaceSpeedConverter";
import { FinalTimeCalculator } from "@/components/tools/FinalTimeCalculator";
import { LapRhythm } from "@/components/tools/LapRhythm";
import { VDOTCalculator } from "@/components/tools/VDOTCalculator";
import { GoalPredictor } from "@/components/tools/GoalPredictor";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-12">
      <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-center">
          <Image src="/logo.png" alt="Run4Fun Tools" width={56} height={56} priority />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-4">
        <PaceSpeedConverter />
        <FinalTimeCalculator />
        <LapRhythm />
        <VDOTCalculator />
        <GoalPredictor />

        <footer className="text-center text-xs text-zinc-700 pt-4 pb-2">
          Run4Fun Tools — Cálculos baseados em Jack Daniels&apos; Running Formula
        </footer>
      </div>
    </main>
  );
}
