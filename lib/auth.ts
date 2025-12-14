import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";

import { prisma } from "./prisma";
import { hashPassword, verifyPasswordHash } from "./password";

const SESSION_COOKIE_NAME = "agt-session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  expires: new Date(Date.now() + SESSION_DURATION_MS)
});

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const setSessionCookie = (token: string) => {
  cookies().set(SESSION_COOKIE_NAME, token, buildCookieOptions());
};

const clearSessionCookie = () => {
  cookies().delete(SESSION_COOKIE_NAME);
};

export const getCurrentUser = async () => {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(sessionToken) },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    clearSessionCookie();
    if (session?.id) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
};

export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/register");
  }
  return user;
};

const createSessionForUser = async (userId: string) => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt
    }
  });

  setSessionCookie(token);
};

export const registerUser = async (username: string, password: string) => {
  const trimmedUsername = username.trim();
  if (!trimmedUsername || !password) {
    throw new Error("ユーザー名とパスワードを入力してください");
  }

  const existing = await prisma.user.findUnique({ where: { username: trimmedUsername } });
  if (existing) {
    throw new Error("この名前は既に使われています");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username: trimmedUsername,
      passwordHash
    }
  });

  await createSessionForUser(user.id);
  return user;
};

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username: username.trim() } });
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  const valid = await verifyPasswordHash(password, user.passwordHash);
  if (!valid) {
    throw new Error("パスワードが正しくありません");
  }

  await createSessionForUser(user.id);
  return user;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  const valid = await verifyPasswordHash(currentPassword, user.passwordHash);
  if (!valid) {
    throw new Error("現在のパスワードが一致しません");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });
};

export const logoutUser = async () => {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(sessionToken) } });
  }
  clearSessionCookie();
};
