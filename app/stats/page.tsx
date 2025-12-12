"use client";

import { aggregateKpis } from "@/lib/calc";
import { SUBJECT_COUNT } from "@/lib/subjects";
import { useCycleStore } from "@/lib/useCycleStore";

function StatNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/70 p-4 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function StatsPage() {
  const { cycles } = useCycleStore();
  const { totalEffective, inGoalSubjects, stagnantSubjects } = aggregateKpis(cycles);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatNumber label="合格分野数" value={`${inGoalSubjects} / ${SUBJECT_COUNT}`} />
        <StatNumber label="総有効周回数" value={`${totalEffective} / 62`} />
        <StatNumber label="停滞分野数" value={`${stagnantSubjects}`} />
      </div>
    </div>
  );
}
