import { PrismaClient } from "@prisma/client";
import { subjects } from "../lib/subjects";
import { seedCycleAccuracies } from "../lib/seedData";

const prisma = new PrismaClient();

async function main() {
  await prisma.studyCycle.deleteMany();
  await prisma.subject.deleteMany();

  await prisma.subject.createMany({
    data: subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      category: subject.category
    })),
    skipDuplicates: true
  });

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Subject"', 'id'), ${subjects.length});`
  );

  const studyCycles = seedCycleAccuracies.flatMap(({ subjectId, accuracies }) =>
    accuracies.map((accuracy) => ({ subjectId, accuracy }))
  );

  await prisma.studyCycle.createMany({
    data: studyCycles,
    skipDuplicates: true
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
