import { useRef, useCallback } from "react";

export function useExpandable() {
  const ref = useRef<HTMLDetailsElement>(null);

  const open = useCallback(() => {
    if (ref.current) {
      ref.current.open = true;
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return { ref, open } as const;
}
