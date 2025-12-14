import { PrismaClient } from "@prisma/client";

import { seedCycleAccuracies } from "../lib/seedData";
import { subjects } from "../lib/subjects";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.session.deleteMany();
  await prisma.studyCycle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();

  await prisma.subject.createMany({
    data: subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      category: subject.category
    }))
  });

  const demoUser = await prisma.user.create({
    data: {
      username: "demo",
      passwordHash: await hashPassword("password")
    }
  });

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const studyCycles = seedCycleAccuracies.flatMap(({ subjectId, accuracies }) =>
    accuracies.map((accuracy, index) => ({
      subjectId,
      accuracy,
      userId: demoUser.id,
      createdAt: new Date(now - index * oneDayMs)
    }))
  );

  await prisma.studyCycle.createMany({
    data: studyCycles
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
