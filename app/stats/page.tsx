"use client";

import { aggregateKpis } from "@/lib/calc";
import { SUBJECT_COUNT } from "@/lib/subjects";
import { useCycleStore } from "@/lib/useCycleStore";

function StatNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/80 p-4 shadow-sm dark:bg-slate-800/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function StatsPage() {
  const { cycles } = useCycleStore();
  const { totalEffective, inGoalSubjects, stagnantSubjects } = aggregateKpis(cycles);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Stats</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatNumber label="合格分野数" value={`${inGoalSubjects} / ${SUBJECT_COUNT}`} />
        <StatNumber label="総有効周回数" value={`${totalEffective} / 62`} />
        <StatNumber label="停滞分野数" value={`${stagnantSubjects}`} />
      </div>
    </div>
  );
}
