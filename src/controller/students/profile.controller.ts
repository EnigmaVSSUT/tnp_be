import ApiError from "../../utils/Handlers/apiError";
import { asyncHandler } from "../../utils/Handlers/asyncHandler";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import ApiResponse from "../../utils/Handlers/apiResponse";
import z from "zod";
import { getStudentByEmail } from "../../services/helper";
const prisma = new PrismaClient();

export const getStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.user?.email;

    if (!email?.trim()) {
      return res
        .status(400)
        .json(ApiError.badRequest("Email is required", 400));
    }

    const studentDetails = await prisma.student.findUnique({
      where: { email },
      include: {
        experiences: true,
        documents: true,
      },
      omit: {
        id: true,
        password: true,
      },
    });

    if (!studentDetails) {
      return res.status(404).json(ApiError.notFound("No student found", 404));
    }

    return res.status(200).json(ApiResponse.success(studentDetails, {}, 200));
  }
);

export const updateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.user?.email;

    const schema = z.object({
      phone: z.string().min(10).max(15).optional(),
      cgpa: z.number().min(0).max(10).optional(),
      activeBacklog: z.number().min(0).optional(),
    });

    const results = schema.safeParse(req.body);
    if (!results.success) {
      const fieldErrors = results.error.flatten().fieldErrors;
      throw new ApiError(
        "validation",
        "Invalid request data",
        fieldErrors,
        422
      );
    }

    const { phone, cgpa, activeBacklog } = results.data;

    if (!email?.trim()) {
      return res
        .status(400)
        .json(ApiError.badRequest("Email is required", 400));
    }

    const student = await getStudentByEmail(email);
    if (!student) {
      return res.status(404).json(ApiError.notFound("No student found", 404));
    }

    const willBeCompleted =
      (cgpa ?? student.cgpa) !== null &&
      (activeBacklog ?? student.activeBacklog) !== null &&
      (phone ?? student.phone) !== null &&
      student.profileImg !== null;

    const updateData: any = {
      profileCompleted: willBeCompleted,
    };

    if (phone !== undefined) updateData.phone = phone;
    if (cgpa !== undefined) updateData.cgpa = cgpa;
    if (activeBacklog !== undefined) updateData.activeBacklog = activeBacklog;

    const studentDetails = await prisma.student.update({
      where: { email },
      data: updateData,
      omit:{
        id:true,
        password:true
      }
    });

    return res.status(200).json(ApiResponse.success(studentDetails, {}, 200));
  }
);