"use client";

import { SubjectRows } from "@/components/grass/SubjectRow";
import { getSubjectStatuses } from "@/lib/calc";
import { subjects } from "@/lib/subjects";
import { useCycleStore } from "@/lib/useCycleStore";

const pickPrioritySubject = (statuses: ReturnType<typeof getSubjectStatuses>) => {
  const candidates = statuses
    .filter(
      (status) =>
        !status.inGoal &&
        status.ineffectiveCount > 0 &&
        (status.effectiveCount === 0 || status.effectiveCount < status.target / 2)
    )
    .sort((a, b) => b.ineffectiveCount - a.ineffectiveCount || a.effectiveCount - b.effectiveCount || a.subjectId - b.subjectId);

  return candidates[0];
};

export default function GridPage() {
  const { cycles } = useCycleStore();
  const statuses = getSubjectStatuses(cycles);
  const remainingSubjects = statuses.filter((status) => !status.inGoal).length;
  const priorityStatus = pickPrioritySubject(statuses);
  const prioritySubject = subjects.find((subject) => subject.id === priorityStatus?.subjectId);

  const instruction = prioritySubject
    ? `残り ${remainingSubjects} 分野が未達です。今日は「${prioritySubject.name}」を解いてください。`
    : remainingSubjects > 0
      ? `残り ${remainingSubjects} 分野が未達です。無効周回を埋める分野だけを選んでください。`
      : "全分野が合格ラインに到達しました。理解維持のための確認だけ行ってください。";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">合格判断</p>
        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{instruction}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
            未達 {remainingSubjects} 分野
          </span>
          {prioritySubject ? (
            <div className="flex items-center gap-2 rounded border border-red-600 bg-red-50 px-3 py-2 text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
              <span className="text-lg" aria-hidden>
                🔥
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide">今日やる分野</p>
                <p className="text-sm font-bold">{prioritySubject.name}</p>
                <p className="text-[11px]">未達・理解不足</p>
              </div>
            </div>
          ) : (
            <span className="rounded border border-emerald-600 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-100">
              今日は優先対象なし
            </span>
          )}
        </div>
      </div>
      <SubjectRows cycles={cycles} statuses={statuses} prioritizedSubjectId={priorityStatus?.subjectId} />
    </div>
  );
}
