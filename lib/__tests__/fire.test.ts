import {
  calculateFireScore,
  calculateForgettingFactor,
  calculateForgettingScore,
  calculateImportanceWeight,
  calculatePriorityWeight,
  calculateShortageFactor,
  pickFireSubjects,
  type FireSubjectInput
} from "../fire";

describe("fire score calculation", () => {
  test("forgetting factor blends Ebbinghaus and linear decay", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const yesterday = new Date("2024-02-09T00:00:00Z");
    const tenDaysAgo = new Date("2024-01-31T00:00:00Z");

    expect(calculateForgettingFactor(yesterday, reference)).toBeLessThan(
      calculateForgettingFactor(tenDaysAgo, reference)
    );
    expect(calculateForgettingFactor(null, reference)).toBe(1.5);
    expect(calculateForgettingScore(tenDaysAgo, reference)).toBeLessThan(1);
  });

  test("shortage factor drops to zero once the goal is met", () => {
    expect(calculateShortageFactor(0, 4)).toBeCloseTo(1.25);
    expect(calculateShortageFactor(3, 4)).toBeCloseTo(0.5);
    expect(calculateShortageFactor(4, 4)).toBe(0);
  });

  test("importance weight follows category mapping", () => {
    expect(calculateImportanceWeight(10)).toBe(1.3);
    expect(calculateImportanceWeight(2)).toBe(1.2);
    expect(calculateImportanceWeight(3)).toBe(1.0);
    expect(calculateImportanceWeight(14)).toBe(0.9);
    expect(calculateImportanceWeight(17)).toBe(0.8);
  });

  test("priority weight follows rank map", () => {
    const { rank, weight } = calculatePriorityWeight(9);
    expect(rank).toBe(1);
    expect(weight).toBeGreaterThan(1);

    const unknown = calculatePriorityWeight(999);
    expect(unknown.rank).toBeNull();
    expect(unknown.weight).toBe(1);
  });

  test("fire subjects are ranked by fire score with tie breakers", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const inputs: FireSubjectInput[] = [
      {
        subjectId: 1,
        lastEffectiveAt: new Date("2024-02-09T00:00:00Z"),
        targetLaps: 3,
        effectiveLaps: 1,
        studiedToday: false
      },
      {
        subjectId: 11,
        lastEffectiveAt: null,
        targetLaps: 4,
        effectiveLaps: 0,
        studiedToday: false
      },
      {
        subjectId: 3,
        lastEffectiveAt: new Date("2024-01-01T00:00:00Z"),
        targetLaps: 3,
        effectiveLaps: 0,
        studiedToday: true
      },
      {
        subjectId: 10,
        lastEffectiveAt: new Date("2024-02-05T00:00:00Z"),
        targetLaps: 4,
        effectiveLaps: 1,
        studiedToday: false
      }
    ];

    const [first, second] = pickFireSubjects(inputs, reference);

    expect(first.subjectId).toBe(11); // 未学習かつ重要度の高い分野が優先
    expect(second.subjectId).toBe(10); // 目標不足と忘却の組み合わせで上位
    expect(first.daysSinceLastEffective).toBeNull();
    expect(second.daysSinceLastEffective).toBeCloseTo(5);
    expect(calculateFireScore(inputs[0], reference)).toBeLessThan(calculateFireScore(inputs[1], reference));
  });

  test("stable ordering is guaranteed when all tie breakers match", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const inputs: FireSubjectInput[] = [
      {
        subjectId: 10,
        lastEffectiveAt: null,
        targetLaps: 4,
        effectiveLaps: 1,
        studiedToday: false
      },
      {
        subjectId: 11,
        lastEffectiveAt: null,
        targetLaps: 4,
        effectiveLaps: 1,
        studiedToday: false
      }
    ];

    const [first, second] = pickFireSubjects(inputs, reference, 2);

    expect(first.subjectId).toBe(10);
    expect(second.subjectId).toBe(11);
  });
});
