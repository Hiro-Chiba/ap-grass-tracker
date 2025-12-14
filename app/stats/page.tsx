import { aggregateKpis } from "@/lib/calc";
import { getCyclesForUser } from "@/lib/cycles";
import { SUBJECT_COUNT } from "@/lib/subjects";

import { requireUser } from "@/lib/auth";

function StatNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/70 p-4 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default async function StatsPage() {
  const user = await requireUser();
  const cycles = await getCyclesForUser(user.id);
  const { inGoalSubjects, notInGoalSubjects, prioritySubjects } = aggregateKpis(cycles);

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">迷ったら、未達と🔥を埋める。</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatNumber label="合格分野数" value={`${inGoalSubjects} / ${SUBJECT_COUNT}`} />
        <StatNumber label="未達分野数" value={`${notInGoalSubjects}`} />
        <StatNumber label="今日やる分野数" value={`${prioritySubjects}`} />
      </div>
    </div>
  );
}
