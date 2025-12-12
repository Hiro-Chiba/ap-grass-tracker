"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "時間を測らない",
    body: "学習時間ではなく、分野を1周解いた事実だけを積み上げます。"
  },
  {
    title: "70%ルール",
    body: "正答率70%以上のみを有効周回（■）としてカウントします。"
  },
  {
    title: "縦線＝合格ライン",
    body: "分野ごとの目標周回数に縦線を引き、到達した分野数を合格圏として表示します。"
  }
];

const STORAGE_KEY = "ap-grass-onboarded";

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = window.localStorage.getItem(STORAGE_KEY);
    if (done) setCompleted(true);
  }, []);

  const markDone = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="space-y-4 rounded border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">オンボーディング済み</p>
        <p className="text-sm text-slate-700 dark:text-slate-200">草UIから周回を積み上げて、縦線到達を目指しましょう。</p>
      </div>
    );
  }

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">オンボーディング</h1>
      <div className="rounded border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-800/50">
        <p className="text-xs uppercase tracking-wide text-slate-500">ステップ {index + 1} / {slides.length}</p>
        <h2 className="mt-2 text-lg font-semibold">{slide.title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{slide.body}</p>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex(Math.max(0, index - 1))}
            className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            戻る
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) {
                markDone();
              } else {
                setIndex((prev) => Math.min(slides.length - 1, prev + 1));
              }
            }}
            className="rounded bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
          >
            {isLast ? "完了" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
