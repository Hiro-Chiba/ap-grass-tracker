/** @jest-environment node */

import { HASH_ROUNDS, hashPassword, verifyPasswordHash } from "../password";

describe("認証ハッシュユーティリティ", () => {
  it("bcryptで規定のラウンド数を使ってハッシュ化する", async () => {
    const hash = await hashPassword("secret-pass");

    expect(hash).toMatch(/^\$2[aby]\$10\$/);
    expect(hash).not.toEqual("secret-pass");
  });

  it("同じパスワードでも毎回異なるソルトを使う", async () => {
    const first = await hashPassword("secret-pass");
    const second = await hashPassword("secret-pass");

    expect(first).not.toEqual(second);
  });

  it("ハッシュとの照合が成功/失敗を正しく返す", async () => {
    const hash = await hashPassword("secret-pass");

    await expect(verifyPasswordHash("secret-pass", hash)).resolves.toBe(true);
    await expect(verifyPasswordHash("wrong-pass", hash)).resolves.toBe(false);
  });

  it("ラウンド数の定数が10である", () => {
    expect(HASH_ROUNDS).toBe(10);
  });
});
