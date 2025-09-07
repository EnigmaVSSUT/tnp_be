import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getStudentByEmail = async (email: string) => {
  const studentDetails =  await prisma.student.findUnique({
    where: { email },
  });
  return studentDetails;
};