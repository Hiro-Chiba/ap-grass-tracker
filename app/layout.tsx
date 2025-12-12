import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import ThemeToggle from "../components/ThemeToggle";

export const metadata: Metadata = {
  title: "AP Grass Tracker",
  description: "応用情報技術者試験のための学習周回トラッカー"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <nav className="flex gap-4 text-sm font-semibold">
              <Link href="/grid" className="hover:underline">
                草UI
              </Link>
              <Link href="/log" className="hover:underline">
                ログ
              </Link>
              <Link href="/stats" className="hover:underline">
                Stats
              </Link>
              <Link href="/onboarding" className="hover:underline">
                Onboarding
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
