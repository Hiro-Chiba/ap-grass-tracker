"use client";

import { useEffect, useState } from "react";
import { sampleCycles } from "./sampleCycles";
import { StudyCycle } from "./types";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "ap-grass-cycles";

export function useCycleStore() {
  const [cycles, setCycles] = useState<StudyCycle[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCycles(JSON.parse(stored) as StudyCycle[]);
    } else {
      setCycles(sampleCycles);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCycles));
    }
  }, []);

  const persist = (next: StudyCycle[]) => {
    setCycles(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const addCycle = (subjectId: number, accuracy: number) => {
    const newCycle: StudyCycle = {
      id: uuid(),
      subjectId,
      accuracy,
      date: new Date().toISOString()
    };
    persist([newCycle, ...cycles]);
  };

  return { cycles, addCycle };
}
