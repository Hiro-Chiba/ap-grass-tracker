import Link from "next/link";

import { requireUser } from "@/lib/auth";

export default async function HomePage() {
  await requireUser();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">AP Grass Tracker</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        草UIと縦線だけで合格戦略がひと目で分かる学習周回トラッカーです。
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white" href="/grid">
          草UIへ進む
        </Link>
        <Link className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" href="/log">
          周回を記録
        </Link>
        <Link className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" href="/stats">
          KPIを確認
        </Link>
      </div>
      <div className="pt-2 text-right">
        <Link className="text-xs font-semibold text-slate-500 underline dark:text-slate-300" href="/settings">
          設定
        </Link>
      </div>
    </div>
  );
}
