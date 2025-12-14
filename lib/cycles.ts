import { prisma } from "./prisma";
import { type StudyCycle } from "./types";

export const getCyclesForUser = async (userId: string): Promise<StudyCycle[]> => {
  const cycles = await prisma.studyCycle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return cycles.map((cycle) => ({
    id: cycle.id,
    subjectId: cycle.subjectId,
    accuracy: cycle.accuracy,
    date: cycle.createdAt.toISOString(),
    userId: cycle.userId
  }));
};

export const addCycle = async (userId: string, subjectId: number, accuracy: number) => {
  const numericAccuracy = Number.isFinite(accuracy) ? accuracy : 0;
  const normalizedAccuracy = Math.min(100, Math.max(0, Math.round(numericAccuracy)));

  await prisma.studyCycle.create({
    data: {
      userId,
      subjectId,
      accuracy: normalizedAccuracy
    }
  });
};
