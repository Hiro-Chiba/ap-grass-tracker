"use client";

import { aggregateKpis, getSubjectStatuses } from "@/lib/calc";
import { EXAM_DATE, daysUntilExam } from "@/lib/examDate";
import { subjects, SUBJECT_COUNT } from "@/lib/subjects";
import { useCycleStore } from "@/lib/useCycleStore";

export default function StatsPage() {
  const { cycles } = useCycleStore();
  const { totalEffective, inGoalSubjects, stagnantSubjects } = aggregateKpis(cycles);
  const statuses = getSubjectStatuses(cycles);
  const remainingDays = daysUntilExam();
  const alertColor = remainingDays < 30 ? "text-red-600" : "text-emerald-600";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Stats</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">数字は合格圏を示すための最小限のみ。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="合格圏分野" value={`${inGoalSubjects} / ${SUBJECT_COUNT}`} description="縦線到達分野" />
        <StatCard title="総有効周回" value={`${totalEffective} / 62`} description="accuracy 70%以上の件数" />
        <StatCard title="停滞分野" value={`${stagnantSubjects}`} description="挑戦あり・有効0" />
      </div>

      <div className="rounded border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/30">
        <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-200">試験日カウントダウン</p>
        <p className={`mt-1 text-lg font-bold ${alertColor}`}>
          残り {remainingDays} 日 （{EXAM_DATE.toLocaleDateString("ja-JP")}）
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300">30日未満で警告色に切り替わります。</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">分野別サマリ</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {statuses.map((status) => {
            const subject = subjects.find((item) => item.id === status.subjectId);
            return (
              <div
                key={status.subjectId}
                className="rounded border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{subject?.name}</p>
                  <span className="text-xs text-slate-500">{status.category}</span>
                </div>
                <p className="text-xs text-slate-500">有効 {status.effectiveCount} / 目標 {status.target}</p>
                <p className="text-xs text-slate-500">無効 {status.ineffectiveCount}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}
