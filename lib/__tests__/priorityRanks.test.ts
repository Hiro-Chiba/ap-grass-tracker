import { priorityRankMap } from "../priorityRanks";

describe("priorityRankMap", () => {
  test("reflects the predefined importance order", () => {
    expect(priorityRankMap[9]).toBe(1); // データベース
    expect(priorityRankMap[10]).toBe(2); // ネットワーク
    expect(priorityRankMap[11]).toBe(3); // セキュリティ
  });

  test("covers all subjects with explicit ranks", () => {
    const uniqueRanks = new Set(Object.values(priorityRankMap));
    expect(Object.keys(priorityRankMap)).toHaveLength(23);
    expect(uniqueRanks.size).toBe(23);
  });
});
