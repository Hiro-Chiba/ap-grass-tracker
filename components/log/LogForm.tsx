"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Subject } from "@/lib/subjects";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "登録中..." : "追加する"}
    </button>
  );
};

type LogFormProps = {
  subjects: Subject[];
  action: (formData: FormData) => Promise<void>;
};

export default function LogForm({ subjects, action }: LogFormProps) {
  const [selectedSubject, setSelectedSubject] = useState<number>(subjects[0]?.id ?? 1);
  const [accuracy, setAccuracy] = useState<number>(80);

  return (
    <form action={action} className="space-y-4 rounded border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <input type="hidden" name="subjectId" value={selectedSubject} />
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
        <span className="text-xs text-slate-500">70%以上で有効周回になります</span>
      </div>
      <SubmitButton />
    </form>
  );
}
