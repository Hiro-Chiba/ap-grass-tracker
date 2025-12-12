"use client";

import { SubjectRows } from "@/components/grass/SubjectRow";
import { useCycleStore } from "@/lib/useCycleStore";

export default function GridPage() {
  const { cycles } = useCycleStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">草UI</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">左：無効周回 / 右：有効周回（70%以上）</p>
        </div>
      </div>
      <SubjectRows cycles={cycles} />
    </div>
  );
}
