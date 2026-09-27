import { useEffect, useState } from "react";
import type { Markup } from "@/lib/journal";
import { loadMarkups, saveMarkups } from "@/lib/sample-storage";

export function usePersistedMarkups(seed: Markup[]) {
  const [markups, setMarkups] = useState(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMarkups(loadMarkups(seed));
    setHydrated(true);
  }, [seed]);

  useEffect(() => {
    if (!hydrated) return;
    saveMarkups(markups);
  }, [markups, hydrated]);

  return [markups, setMarkups] as const;
}
