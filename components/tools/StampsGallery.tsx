"use client";
import { useState, useCallback } from "react";

const STAMPS = {
  preto: [
    { file: "foryoudireita.png", label: "For You Direita" },
    { file: "foryouesquerda.png", label: "For You Esquerda" },
    { file: "foryoumeio.png", label: "For You Meio" },
    { file: "logopreto.png", label: "Logo" },
    { file: "r4fpreto.png", label: "R4F" },
    { file: "run4funpreto.png", label: "Run4Fun" },
    { file: "runningclubdireita.png", label: "Running Club Dir." },
    { file: "runningclubesquerda.png", label: "Running Club Esq." },
    { file: "runningclubmeio.png", label: "Running Club Meio" },
  ],
  branco: [
    { file: "foryoudireitabranco.png", label: "For You Direita" },
    { file: "logobranco.png", label: "Logo" },
    { file: "r4fbranco.png", label: "R4F" },
    { file: "run4funbranco.png", label: "Run4Fun" },
    { file: "runforyoudireitabranco.png", label: "Run For You Dir." },
    { file: "runforyoumeio branco.png", label: "Run For You Meio" },
    { file: "runningclubdireitabranco.png", label: "Running Club Dir." },
    { file: "runningclubesquerdabranco.png", label: "Running Club Esq." },
    { file: "runningclubmeiobranco.png", label: "Running Club Meio" },
  ],
};

export function StampsGallery() {
  const [tab, setTab] = useState<"preto" | "branco">("preto");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback(async (file: string) => {
    try {
      const res = await fetch(`/stamps/${encodeURIComponent(file)}`);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(file);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not supported
    }
  }, []);

  const stamps = STAMPS[tab];
  const isPreto = tab === "preto";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("preto")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "preto" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Preto
        </button>
        <button
          onClick={() => setTab("branco")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "branco" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Branco
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stamps.map(({ file, label }) => {
          const isCopied = copied === file;
          return (
            <button
              key={file}
              onClick={() => handleCopy(file)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-3 border transition-all active:scale-95 ${
                isCopied
                  ? "border-green-500 bg-green-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center p-3 ${
                  isPreto ? "bg-white" : "bg-black border border-zinc-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/stamps/${encodeURIComponent(file)}`}
                  alt={label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  isCopied ? "text-green-400" : "text-zinc-400"
                }`}
              >
                {isCopied ? "Copiado!" : label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
