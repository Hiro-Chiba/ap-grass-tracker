"use client";

import { useFormState, useFormStatus } from "react-dom";

type FormState = {
  error?: string;
};

type RegisterFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "設定中..." : "はじめる"}
    </button>
  );
};

export default function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="username">
          名前
        </label>
        <input
          id="username"
          name="username"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="3〜20文字"
          minLength={3}
          maxLength={20}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="6〜64文字"
          minLength={6}
          maxLength={64}
          required
        />
      </div>
      {state?.error ? (
        <p className="text-sm font-semibold text-rose-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
      <p className="text-xs text-slate-500 dark:text-slate-300">
        初回はそのまま登録し、次回以降は同じ名前とパスワードで続きから使えます。
      </p>
    </form>
  );
}
