"use client";

import { useCallback, useEffect, useState } from "react";
import { StudyCycle } from "./types";

export function useCycleStore() {
  const [cycles, setCycles] = useState<StudyCycle[]>([]);
  const [initialized, setInitialized] = useState(false);

  const fetchCycles = useCallback(async () => {
    if (typeof fetch === "undefined") return;
    try {
      const response = await fetch("/api/cycles");
      if (!response.ok) {
        throw new Error("failed to fetch cycles");
      }
      const data = (await response.json()) as StudyCycle[];
      setCycles(data);
    } catch (error) {
      console.error("Failed to load cycles", error);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    void fetchCycles();
  }, [fetchCycles]);

  const addCycle = async (subjectId: number, accuracy: number) => {
    const response = await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, accuracy })
    });

    if (!response.ok) {
      throw new Error("failed to save cycle");
    }

    const created = (await response.json()) as StudyCycle;
    setCycles((prev) => [created, ...prev]);
  };

  return { cycles, addCycle, initialized };
}
