import { PrismaClient } from "@prisma/client";
import { subjects } from "../lib/subjects";

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

  await prisma.studyCycle.createMany({
    data: [
      { subjectId: 7, accuracy: 85 },
      { subjectId: 8, accuracy: 60 },
      { subjectId: 9, accuracy: 75 }
    ],
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
