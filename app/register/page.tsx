import Link from "next/link";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser, loginUser, registerUser } from "@/lib/auth";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/grid");
  }

  const handleSubmit = async (_state: { error?: string }, formData: FormData) => {
    "use server";

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await registerUser(username, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "登録に失敗しました";
      if (message === "この名前は既に使われています") {
        try {
          await loginUser(username, password);
        } catch (loginError) {
          const loginMessage = loginError instanceof Error ? loginError.message : "登録に失敗しました";
          return { error: loginMessage };
        }
      } else {
        return { error: message };
      }
    }

    redirect("/grid");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-600">first run</p>
        <h1 className="text-2xl font-bold">名前とパスワードだけで開始</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">ログイン画面を挟まず、すぐ草UIへ入ります。</p>
      </div>
      <RegisterForm action={handleSubmit} />
      <div className="text-center text-xs text-slate-500 dark:text-slate-300">
        <p>入力は一度だけ。設定は後から変更できます。</p>
        <Link href="/onboarding" className="text-emerald-700 underline dark:text-emerald-300">
          プロダクトの使い方を見る
        </Link>
      </div>
    </div>
  );
}
