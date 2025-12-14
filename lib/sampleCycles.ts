import { buildSeedCycles } from "./seedData";
import { StudyCycle } from "./types";

const seededCycles = buildSeedCycles();

export const sampleCycles: StudyCycle[] = seededCycles.map((cycle, index) => ({
  id: `seed-${cycle.subjectId}-${index}`,
  subjectId: cycle.subjectId,
  accuracy: cycle.accuracy,
  date: cycle.date
}));
