// src/prismaClient.ts
import { PrismaClient } from "./generated/prisma";  // ✅ from generated folder, not @prisma/client

export const prisma = new PrismaClient();
