import PasswordForm from "@/components/settings/PasswordForm";
import { changePassword, logoutUser, requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await requireUser();

  const handlePasswordChange = async (
    _state: { error?: string; success?: string },
    formData: FormData
  ) => {
    "use server";

    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");

    try {
      await changePassword(user.id, currentPassword, newPassword);
      return { success: "パスワードを変更しました" };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "更新に失敗しました" };
    }
  };

  const handleLogout = async () => {
    "use server";
    await logoutUser();
    redirect("/register");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs font-semibold text-slate-500">ユーザー名</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{user.username}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">パスワード変更</h2>
        <PasswordForm action={handlePasswordChange} />
      </div>

      <form action={handleLogout} className="pt-4">
        <button
          type="submit"
          className="w-full rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
