"use client";

import { useCycleStore } from "@/lib/useCycleStore";
import { subjects } from "@/lib/subjects";
import { useState } from "react";
import { StudyCycle } from "@/lib/types";
import { isEffectiveCycle } from "@/lib/calc";

export default function LogPage() {
  const { cycles, addCycle } = useCycleStore();
  const [selectedSubject, setSelectedSubject] = useState<number>(subjects[0].id);
  const [accuracy, setAccuracy] = useState<number>(80);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCycle(selectedSubject, accuracy);
  };

  const latest = cycles.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">周回記録</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">分野を選択し、正答率を入力して1タップで追加。</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">分野を選択</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                type="button"
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`rounded px-3 py-2 text-xs font-semibold shadow-sm transition ${
                  selectedSubject === subject.id
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="accuracy">
            正答率
          </label>
          <input
            id="accuracy"
            name="accuracy"
            type="number"
            min={0}
            max={100}
            value={accuracy}
            onChange={(e) => setAccuracy(Number(e.target.value))}
            className="w-24 rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <span className="text-xs text-slate-500">70%以上で有効周回</span>
        </div>
        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
          追加する
        </button>
      </form>

      <section>
        <h2 className="text-lg font-bold">最新の記録</h2>
        <ul className="mt-3 space-y-2">
          {latest.map((cycle: StudyCycle) => {
            const subject = subjects.find((item) => item.id === cycle.subjectId);
            return (
              <li
                key={cycle.id}
                className="flex items-center justify-between rounded border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div>
                  <p className="font-semibold">{subject?.name}</p>
                  <p className="text-xs text-slate-500">{new Date(cycle.date).toLocaleString("ja-JP")}</p>
                </div>
                <span className={`text-sm font-bold ${isEffectiveCycle(cycle.accuracy) ? "text-emerald-600" : "text-slate-500"}`}>
                  {cycle.accuracy}%
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
