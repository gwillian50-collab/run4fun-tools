"use client";
import { useState, useCallback } from "react";

const STAMPS = {
  preto: [
    { file: "foryoudireita.png" },
    { file: "foryouesquerda.png" },
    { file: "foryoumeio.png" },
    { file: "logopreto.png" },
    { file: "r4fpreto.png" },
    { file: "run4funpreto.png" },
    { file: "runningclubdireita.png" },
    { file: "runningclubesquerda.png" },
    { file: "runningclubmeio.png" },
    { file: "simplespreto.png" },
  ],
  branco: [
    { file: "foryoudireitabranco.png" },
    { file: "logobranco.png" },
    { file: "r4fbranco.png" },
    { file: "run4funbranco.png" },
    { file: "runforyoudireitabranco.png" },
    { file: "runforyoumeio branco.png" },
    { file: "runningclubdireitabranco.png" },
    { file: "runningclubesquerdabranco.png" },
    { file: "runningclubmeiobranco.png" },
    { file: "simplesbranco.png" },
  ],
};

const FOLDER: Record<"preto" | "branco", string> = {
  preto: "fundobranco",
  branco: "fundopreto",
};

export function StampsGallery() {
  const [tab, setTab] = useState<"preto" | "branco">("preto");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback(async (folder: string, file: string) => {
    try {
      const res = await fetch(`/stamps/${folder}/${encodeURIComponent(file)}`);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(file);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not supported
    }
  }, []);

  const stamps = STAMPS[tab];
  const folder = FOLDER[tab];
  const isPreto = tab === "preto";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Share</span>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("preto")}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "preto" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Preto
          </button>
          <button
            onClick={() => setTab("branco")}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "branco" ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Branco
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stamps.map(({ file }) => {
          const isCopied = copied === file;
          return (
            <button
              key={file}
              onClick={() => handleCopy(folder, file)}
              className={`rounded-2xl p-3 border transition-all active:scale-95 ${
                isCopied
                  ? "border-green-500 bg-green-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center p-4 ${
                  isPreto ? "bg-white" : "bg-black border border-zinc-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/stamps/${folder}/${encodeURIComponent(file)}`}
                  alt=""
                  className={`w-full h-full object-contain transition-opacity ${isCopied ? "opacity-50" : ""}`}
                />
              </div>
              {isCopied && (
                <span className="block text-xs font-medium text-center text-green-400 mt-2">
                  Copiado!
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
