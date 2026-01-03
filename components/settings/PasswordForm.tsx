"use client";

import { useFormState, useFormStatus } from "react-dom";

type FormState = {
  error?: string;
  success?: string;
};

type PasswordFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
      disabled={pending}
    >
      {pending ? "更新中..." : "パスワードを変更"}
    </button>
  );
};

export default function PasswordForm({ action }: PasswordFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="currentPassword">
          現在のパスワード
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="newPassword">
          新しいパスワード
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
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
      {state?.success ? (
        <p className="text-sm font-semibold text-emerald-600" role="status">
          {state.success}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
