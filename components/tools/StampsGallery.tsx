"use client";
import { useState, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const STAMPS = {
  preto: [
    { file: "1logobranco.png" },
    { file: "2kippinho.png" },
    { file: "3run4funbranco.png" },
    { file: "4r4fbranco.png" },
    { file: "5runningclubesquerdabranco.png" },
    { file: "6runningclubmeiobranco.png" },
    { file: "7runningclubdireitabranco.png" },
    { file: "8foryoudireitabranco.png" },
    { file: "9runforyoumeio branco.png" },
    { file: "10runforyoudireitabranco.png" },
  ],
  branco: [
    { file: "1logopreto.png" },
    { file: "2simplespreto.png" },
    { file: "3r4fpreto.png" },
    { file: "4run4funpreto.png" },
    { file: "5foryouesquerda.png" },
    { file: "6foryoumeio.png" },
    { file: "7foryoudireita.png" },
    { file: "8runningclubesquerda.png" },
    { file: "9runningclubmeio.png" },
    { file: "10runningclubdireita.png" },
  ],
};

const FOLDER: Record<"preto" | "branco", string> = {
  preto: "fundopreto",
  branco: "fundobranco",
};

export function StampsGallery() {
  const [tab, setTab] = useLocalStorage<"preto" | "branco">("r4f_stamps_tab", "preto");
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
        <div>
          <span className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Share</span>
          <p className="text-xs text-zinc-500 mt-0.5">basta clicar para copiar</p>
        </div>

        <button
          onClick={() => setTab(isPreto ? "branco" : "preto")}
          className="relative flex items-center w-14 h-7 rounded-full border border-zinc-600 transition-colors duration-300 overflow-hidden focus:outline-none"
          style={{ background: isPreto ? "#000000" : "#ffffff" }}
          aria-label={isPreto ? "Mudar para fundo branco" : "Mudar para fundo preto"}
        >
          <span
            className={`absolute w-5 h-5 rounded-full shadow transition-all duration-300 ${
              isPreto
                ? "left-1 bg-white"
                : "left-8 bg-black"
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stamps.map(({ file }) => {
          const isCopied = copied === file;
          return (
            <button
              key={file}
              onClick={() => handleCopy(folder, file)}
              className={`rounded-2xl p-3 border transition-all active:scale-95 ${
                isCopied ? "border-green-500 bg-green-500/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center p-4 ${
                  isPreto ? "bg-black border border-zinc-800" : "bg-white"
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
                <span className="block text-xs font-medium text-center text-green-400 mt-2">Copiado!</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
