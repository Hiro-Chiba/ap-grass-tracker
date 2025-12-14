import LogForm from "@/components/log/LogForm";
import { isEffectiveCycle } from "@/lib/calc";
import { addCycle, getCyclesForUser } from "@/lib/cycles";
import { subjects } from "@/lib/subjects";
import { StudyCycle } from "@/lib/types";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";

const formatDateTime = (value: string) => new Date(value).toLocaleString("ja-JP");

export default async function LogPage() {
  const user = await requireUser();
  const cycles = await getCyclesForUser(user.id);
  const latest = cycles.slice(0, 5);

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const subjectId = Number(formData.get("subjectId"));
    const accuracy = Number(formData.get("accuracy"));
    const subject = subjects.find((item) => item.id === subjectId) ?? subjects[0];

    await addCycle(user.id, subject.id, accuracy);
    revalidatePath("/grid");
    revalidatePath("/log");
    revalidatePath("/stats");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">周回記録</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">分野を選択し、正答率を入力して1タップで追加。</p>
      </div>

      <LogForm subjects={subjects} action={handleSubmit} />

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
                  <p className="text-xs text-slate-500">{formatDateTime(cycle.date)}</p>
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
