import { aggregateKpis } from "@/lib/calc";
import { getCyclesForUser } from "@/lib/cycles";
import { daysUntilExam, EXAM_DATE } from "@/lib/examDate";
import { getSubjects } from "@/lib/subjectsStore";

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
  const subjects = await getSubjects();
  const { inGoalSubjects, notInGoalSubjects, prioritySubjects } = aggregateKpis(cycles, subjects);
  const remainingDays = daysUntilExam();
  const examDateLabel = EXAM_DATE.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const warning = remainingDays <= 30;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">迷ったら、未達と🔥を埋める。</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatNumber label="合格分野数" value={`${inGoalSubjects} / ${subjects.length}`} />
        <StatNumber label="未達分野数" value={`${notInGoalSubjects}`} />
        <StatNumber label="今日やる分野数" value={`${prioritySubjects}`} />
      </div>
      <div
        className={`rounded-lg border p-4 text-center text-sm font-semibold shadow-sm ${
          warning
            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
            : "border-slate-200/70 bg-white/70 text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-200"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">試験日まで</p>
        <p className="mt-2 text-2xl font-bold">{remainingDays} 日</p>
        <p className="mt-1 text-xs">{examDateLabel}</p>
      </div>
    </div>
  );
}
