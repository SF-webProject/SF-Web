// src/lib/hardDelete.ts
import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;
const DELETE_AFTER_DAYS = 30;

export default async function autoDelete() {
  const time = new Date(
    Date.now() - DELETE_AFTER_DAYS * DAY
  );

  const result = await prisma.post.deleteMany({
    where: {
      deletedAt: {
        not: null,
        lte: time,
      },
    },
  });

  
}

