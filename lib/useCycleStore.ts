"use client";

import { useCallback, useEffect, useState } from "react";
import { sampleCycles } from "./sampleCycles";
import { StudyCycle } from "./types";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "ap-grass-cycles";

const parseStoredCycles = (stored: string | null): StudyCycle[] | null => {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as StudyCycle[];
    }
  } catch {
    // 不正な JSON は無視して初期データで復旧する
  }
  return null;
};

export function useCycleStore() {
  const [cycles, setCycles] = useState<StudyCycle[]>([]);

  const saveCycles = useCallback((updater: (prev: StudyCycle[]) => StudyCycle[]) => {
    setCycles((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    saveCycles(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return parseStoredCycles(stored) ?? sampleCycles;
    });
  }, [saveCycles]);

  const addCycle = (subjectId: number, accuracy: number) => {
    const newCycle: StudyCycle = {
      id: uuid(),
      subjectId,
      accuracy,
      date: new Date().toISOString()
    };
    saveCycles((prev) => [newCycle, ...prev]);
  };

  return { cycles, addCycle };
}
