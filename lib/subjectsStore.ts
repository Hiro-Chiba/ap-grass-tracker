import "server-only";

import { prisma } from "./prisma";
import { subjects, type Category, type Subject } from "./subjects";

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const stored = await prisma.subject.findMany({ orderBy: { id: "asc" } });
    if (stored.length === 0) return subjects;
    return stored.map((subject) => ({
      id: subject.id,
      name: subject.name,
      category: subject.category as Category
    }));
  } catch (error) {
    console.error("subjects load failed", error);
    return subjects;
  }
};
